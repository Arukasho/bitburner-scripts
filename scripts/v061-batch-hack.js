/** @param {NS} ns */
export async function main(ns) {
  // This script assumes root access to target is true. 

  // Initial Parameters
  // To call script from terminal --> run v052-batch-hack.js hack-script-host-name target-server-name
  const growWeakenHost = ns.args[0]; // this is used to be the host of grow and weaken scripts
  const hackHost = ns.args[1]; // initial server to run prep loop
  const target = ns.args[2]; // target server to hack money from
  const numCores = ns.getServer(growWeakenHost).cpuCores; // grow and weaken host number of cores
  const moneyToStealPerHack = 5; // In Percent
  const targetMaxMoney = ns.getServerMaxMoney(target);
  const minSecurityLevel = ns.getServerMinSecurityLevel(target);


  function getHackThread() {
    // Find out how many threads needed to hack 20% of target server's max money
    let moneyPerThread = ns.hackAnalyze(target); // result in percentage
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

  function getBatchGrowThread(hackThread) {
    let moneyPerThread = ns.hackAnalyze(target); // Result in percentage
    let moneyHacked = (hackThread * moneyPerThread) * targetMaxMoney;

    moneyHacked = Math.min(moneyHacked, targetMaxMoney * 0.99)

    let growMultiplier = targetMaxMoney / (targetMaxMoney - moneyHacked);
    let growThread = Math.ceil(ns.growthAnalyze(target, growMultiplier, numCores));
    
    return growThread;
  }

  function getPrepSecurityDifference() {
    let securityLevel = ns.getServerSecurityLevel(target);
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

  function getHackSecurityIncrease(hackThread) {
    // Get security increase number from hack process
    let securityIncrease = ns.hackAnalyzeSecurity(hackThread, target);

    return securityIncrease;
  }

  function getGrowSecurityIncrease(growThread) {
    // Get security increase number from grow process
    let securityIncrease = ns.growthAnalyzeSecurity(growThread, target, numCores);

    return securityIncrease;
  }

  function getAfterGrowWeakenThread(growThread) {
    // Find out the best amount of threads to allocate to negate security increase after grow
    let weakenEffectPerThread = ns.weakenAnalyze(1, numCores);
    let weakenThread = Math.ceil(getGrowSecurityIncrease(growThread) / weakenEffectPerThread);

    return weakenThread;
  }

  function getAfterHackWeakenThread(hackThread) {
    // Find out the best amount of threads to allocate to negate security increase after hack
    let weakenEffectPerThread = ns.weakenAnalyze(1, numCores);
    let weakenThread = Math.ceil(getHackSecurityIncrease(hackThread) / weakenEffectPerThread);

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
    // Loop condition = Current money is less than target server max money 
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
    
    // Hack Weaken Grow Weaken (HWGW) Loop
    while (ns.getServerMoneyAvailable(target) >= (targetMaxMoney * ((moneyToStealPerHack * 3) / 100))) {
      
      let wknTime = ns.getWeakenTime(target);
      let hckTime = ns.getHackTime(target);
      let grwTime = ns.getGrowTime(target);

      let hackThread = getHackThread();
      let growThread = getBatchGrowThread(hackThread);
      let weakenGrowThread = getAfterGrowWeakenThread(growThread);
      let weakenHackThread = getAfterHackWeakenThread(hackThread);

      // Weaken 1 -> Negate Hack Effect
      ns.exec("weaken.js", growWeakenHost, weakenHackThread, target);
      await ns.sleep(200);

      // Weaken 2 -> Negate Grow Effect
      if (weakenGrowThread > 0) {
        ns.exec("weaken.js", growWeakenHost, weakenGrowThread, target);
        await ns.sleep(wknTime - grwTime - 100);
      }
      
      // Grow Process
      if (growThread > 0) {
        ns.exec("grow.js", growWeakenHost, growThread, target);
        await ns.sleep(grwTime - hckTime - 150);
      }

      // Hack Process
      ns.exec("hack.js", hackHost, hackThread, target);
      await ns.sleep(100);

    }
  }

}