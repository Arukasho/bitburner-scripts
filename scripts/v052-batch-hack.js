/** @param {NS} ns */
export async function main(ns) {
  // This script assumes root access to target is true. 

  // Initial Parameters
  // To call script from terminal --> run v052-batch-hack.js hack-script-host-name target-server-name
  const growWeakenHost = "home"; // home server is used to be the host of grow and weaken scripts to utilize the multiple cores of the server
  const hackHost = ns.args[0]; // initial server to run prep loop
  const target = ns.args[1]; // target server to hack money from
  const numCores = ns.getServer(growWeakenHost).cpuCores; // grow and weaken host number of cores
  const moneyToStealPerHack = 20; // In Percent
  const targetMaxMoney = ns.getServerMaxMoney(target);
  const minSecurityLevel = ns.getServerMinSecurityLevel(target);


  function getHackThread() {
    // Find out how many threads needed to hack 20% of target server's max money
    let moneyPerThread = ns.hackAnalyze(target);
    let hackThread = Math.ceil((moneyToStealPerHack / 100)/ moneyPerThread);
  
    return hackThread;
  }

  function getPrepGrowThread() {
    // Find out how many threads needed for prep grow process
    let targetCurrentMoney = ns.getServerMoneyAvailable(target);
    
    // If target server's money is 0, change value to 1 to prevent division by 0
    if (targetCurrentMoney < 1) {
        targetCurrentMoney = 1;
    }

    let growMultiplier = targetMaxMoney / targetCurrentMoney;
    let growThread = Math.ceil(ns.growthAnalyze(target, growMultiplier, numCores));
    
    return growThread;
  }

  function getBatchGrowThread() {
    let moneyPerThread = ns.hackAnalyze(target);
    let hackThread = Math.ceil((moneyToStealPerHack / 100)/ moneyPerThread);
    let moneyHacked = hackThread * moneyPerThread;

    let growMultiplier = targetMaxMoney / (targetMaxMoney - moneyHacked);
    let growThread = Math.ceil(ns.growthAnalyze(target, growMultiplier, numCores));
    
    return growThread;
  }

  function getPrepSecurityDifference() {
    let securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
    let securityDifference = securityLevel - minSecurityLevel;

    return securityDifference
  }

  function getPrepWeakenThread() {
    // Find out the best amount of threads to allocate to get close to
    // the minimum security level
    let weakenEffectPerThread = ns.weakenAnalyze(1, numCores);
    let weakenThread = Math.ceil(getPrepSecurityDifference() / weakenEffectPerThread);

    return weakenThread;
  }

  function getBatchSecurityIncrease(hackThread, growThread) {
    // Get security increase number from hack and grow attempts
    const hackSec = ns.hackAnalyzeSecurity(hackThread, target);
    const growSec = ns.growthAnalyzeSecurity(growThread, target, numCores);
    const securityIncrease = hackSec + growSec;

    return securityIncrease;
  }

  function getBatchWeakenThread(hackThread, growThread) {
    // Find out the best amount of threads to allocate to get close to
    // the minimum security level
    let weakenEffectPerThread = ns.weakenAnalyze(1, numCores);
    let weakenThread = Math.ceil(getBatchSecurityIncrease(hackThread, growThread) / weakenEffectPerThread);

    return weakenThread;
  }

  // Initial server preparation before hacking attempt (min security and max money)

  // While initial money is zero, grow to ensure thread count > 1
  while (ns.getServerMoneyAvailable(target) < 1) {
    await ns.grow(target);
  }

  // Mother Loop
  while (true) {
    // Prep Loop
    // Loop condition = Current money is less than the amount to be stolen per batch times 3 
    // or when grow Thread is more than the main host server can handle
    while (ns.getServerMoneyAvailable(target) < targetMaxMoney) {

      let wknTime = ns.getWeakenTime(target);
      let grwTime = ns.getGrowTime(target);

      let weakenThread = getPrepWeakenThread();
      let growThread = getPrepGrowThread();

      if (getPrepSecurityDifference() >= 1) {
        ns.exec("weaken.js", growWeakenHost, weakenThread, target);
        await ns.sleep(wknTime - grwTime - 20);
      }

      // Find out how many grow threads the grow and weaken host sever can handle
      let growWeakenHostRAM = ns.getServerMaxRam(growWeakenHost);
      let scriptRAMUsage = ns.getScriptRam("grow.js"); // each grow.js and weaken.js scripts use the same amount of RAM
      let growWeakenHostCapacity = Math.floor(growWeakenHostRAM / scriptRAMUsage); // How many grow threads the prep host can handle

      // if grow thread + weaken thread is more than prep host capacity,
      // limit grow thread to 70% of prep host capacity
      // if not, proceed normally
      let growThreadToUse = growThread;
      if (growThread + weakenThread > growWeakenHostCapacity) {
        growThreadToUse = growWeakenHostCapacity * 0.7;
      }

      if (growThreadToUse > 0) {
        ns.exec("grow.js", growWeakenHost, growThreadToUse, target);
        await ns.sleep(grwTime - 20);
      }
      
    }
    
    // Hack loop
    while (ns.getServerMoneyAvailable(target) >= (targetMaxMoney * ((moneyToStealPerHack * 3) / 100))) {
      
      let wknTime = ns.getWeakenTime(target);
      let hckTime = ns.getHackTime(target);
      let grwTime = ns.getGrowTime(target);

      let growThread = getBatchGrowThread();
      let hackThread = getHackThread();
      let weakenThread = getBatchWeakenThread(hackThread, growThread);

      // weaken --> security from after-grow to min
      ns.exec("weaken.js", growWeakenHost, weakenThread, target);
      await ns.sleep(wknTime - grwTime - 20);

      // grow --> from after-hack to max
      if (growThread > 1) {
        ns.exec("grow.js", growWeakenHost, growThread, target);
        await ns.sleep(grwTime - hckTime - 20);
      }

      // hack a certain percentage of the server's max money
      ns.exec("hack.js", hackHost, hackThread, target);
      await ns.sleep(hckTime - 20);

    }
  }

}