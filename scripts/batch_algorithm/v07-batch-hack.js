/** @param {NS} ns */
export async function main(ns) {

  // Assign servers variables
  const hostServer = ns.args[0]; // host to run HGW scripts from
  const targetServer = ns.args[1]; // target server to hack money from

  const scriptsHGW = [
    "batch_algorithm/hack.js", 
    "batch_algorithm/grow.js",
    "batch_algorithm/weaken.js",
    ]

  // If any of the arguments are empty, notify user how to call the script
  // To call script from terminal --> run script-name.js host-server-name target-server-name
  if (hostServer === undefined || targetServer === undefined) {
    ns.tprint("To call script from terminal --> run script-name.js host-server-name target-server-name")
    return;
  }

  // Gain root access of target server if not yet available 
  if (!ns.hasRootAccess(targetServer)) {
    if (ns.fileExists("BruteSSH.exe", hostServer)) {
      ns.brutessh(targetServer);
    }
    if (ns.fileExists("FTPCrack.exe", hostServer)) {
      ns.ftpcrack(targetServer);
    }
    if (ns.fileExists("relaySMTP.exe", hostServer)) {
      ns.relaysmtp(targetServer);
    }
    ns.nuke(targetServer);
  }

  // Root access check, kill script if root access false
  if (!ns.hasRootAccess(targetServer)) {
    return;
  }

  // If HGW scripts do not exist on host server, copy HGW scripts from home to the host server
  if (!ns.fileExists("batch_algorithm/hack.js", hostServer)) {
    ns.scp(scriptsHGW, hostServer, "home")
  }

  const hostNumCores = ns.getServer(hostServer).cpuCores; // Host server number of cores
  const moneyToStealPerHack = 15; // In Percent
  let targetServerMaxMoney = ns.getServerMaxMoney(targetServer);
  const minSecurityLevel = ns.getServerMinSecurityLevel(targetServer);


  function getHackThread() {
    // Find out how many threads needed to hack moneyToStealPerHack(%) of target server's max money
    let moneyPerThread = ns.hackAnalyze(targetServer); // result in percentage
    let hackThread = Math.ceil((moneyToStealPerHack / 100) / moneyPerThread);

    return hackThread;
  }

  function getPrepGrowThread() {
    // Find out how many threads needed for prep grow process
    let targetServerCurrentMoney = ns.getServerMoneyAvailable(targetServer);

    // If target server's money is 0, change value to 1 to prevent division by 0
    if (targetServerCurrentMoney < 1) {
      targetServerCurrentMoney = 1;
    }

    let growMultiplier = targetServerMaxMoney / targetServerCurrentMoney;
    let growThread = Math.ceil(ns.growthAnalyze(targetServer, growMultiplier, hostNumCores));

    return growThread;
  }

  function getBatchGrowThread(hackThread) {
    // Catch Thread Count if below 0 or is not a number
    if (hackThread < 1 || isNaN(hackThread)) {
      hackThread = 1;
    }

    let moneyPerThread = ns.hackAnalyze(targetServer); // Result in percentage
    let moneyHacked = (hackThread * moneyPerThread) * targetServerMaxMoney;

    moneyHacked = Math.min(moneyHacked, targetServerMaxMoney * 0.99)

    let growMultiplier = targetServerMaxMoney / (targetServerMaxMoney - moneyHacked);
    let growThread = Math.ceil(ns.growthAnalyze(targetServer, growMultiplier, hostNumCores));

    return growThread;
  }

  function getPrepSecurityDifference() {
    let securityLevel = ns.getServerSecurityLevel(targetServer);
    let securityDifference = securityLevel - minSecurityLevel;

    return securityDifference
  }

  function getPrepWeakenThread() {
    // Find out the best amount of threads to allocate to get close to
    // the minimum security level
    let weakenEffectPerThread = ns.weakenAnalyze(1, hostNumCores);
    let weakenThread = Math.ceil(getPrepSecurityDifference() / weakenEffectPerThread);

    return Math.max(1, weakenThread);
  }

  function getHackSecurityIncrease(hackThread) {
    // Catch Thread Count if below 0 or is not a number
    if (hackThread < 1 || isNaN(hackThread)) {
      hackThread = 1;
    }
    // Get security increase number from hack process
    let securityIncrease = ns.hackAnalyzeSecurity(hackThread, targetServer);

    return securityIncrease;
  }

  function getGrowSecurityIncrease(growThread) {
    // Catch Thread Count if below 0 or is not a number
    if (growThread < 1 || isNaN(growThread)) {
      growThread = 1;
    }
    // Get security increase number from grow process
    let securityIncrease = ns.growthAnalyzeSecurity(growThread, targetServer, hostNumCores);

    return securityIncrease;
  }

  function getAfterGrowWeakenThread(growThread) {
    // Catch Thread Count if below 0 or is not a number
    if (growThread < 1 || isNaN(growThread)) {
      growThread = 1;
    }
    // Find out the best amount of threads to allocate to negate security increase after grow
    let weakenEffectPerThread = ns.weakenAnalyze(1, hostNumCores);
    let weakenThread = Math.ceil(getGrowSecurityIncrease(growThread) / weakenEffectPerThread);

    return weakenThread;
  }

  function getAfterHackWeakenThread(hackThread) {
    // Catch Thread Count if below 0 or is not a number
    if (hackThread < 1 || isNaN(hackThread)) {
      hackThread = 1;
    }
    // Find out the best amount of threads to allocate to negate security increase after hack
    let weakenEffectPerThread = ns.weakenAnalyze(1, hostNumCores);
    let weakenThread = Math.ceil(getHackSecurityIncrease(hackThread) / weakenEffectPerThread);

    return weakenThread;
  }

  async function prepLoop() {
    let wknTime = ns.getWeakenTime(targetServer);
    let grwTime = ns.getGrowTime(targetServer);

    let weakenThread = getPrepWeakenThread();
    let growThread = getPrepGrowThread();

    ns.print(`----- Prep Grow: ${growThread} Prep W: ${weakenThread}`);


    ns.exec("batch_algorithm/weaken.js", hostServer, weakenThread, targetServer);
    await ns.sleep(wknTime - grwTime - 20);


    // Find out how many grow threads the grow and weaken host sever can handle
    let hostServerRAM = ns.getServerMaxRam(hostServer);
    let scriptRAMUsage = ns.getScriptRam("batch_algorithm/grow.js"); // each grow.js and weaken.js scripts use the same amount of RAM
    let hostServerCapacity = Math.floor(hostServerRAM / scriptRAMUsage); // How many grow threads the prep host can handle

    // if grow thread + weaken thread is more than host capacity,
    // limit grow thread to 70% of host capacity
    // if not, proceed normally
    // Initial grow process usually needs much higher RAM
    let growThreadToUse = growThread;
    if (growThread + weakenThread > hostServerCapacity) {
      growThreadToUse = Math.ceil(hostServerCapacity * 0.7);
    }

    if (growThreadToUse > 0) {
      ns.exec("batch_algorithm/grow.js", hostServer, growThreadToUse, targetServer);
    }
  }

  async function mainLoop() {
    let wknTime = ns.getWeakenTime(targetServer);
    let hckTime = ns.getHackTime(targetServer);
    let grwTime = ns.getGrowTime(targetServer);

    let hackThread = getHackThread();
    let growThread = getBatchGrowThread(hackThread);
    let weakenGrowThread = getAfterGrowWeakenThread(growThread);
    let weakenHackThread = getAfterHackWeakenThread(hackThread);

    ns.print(`----- Hack: ${hackThread} Grow: ${growThread} W1: ${weakenHackThread} W2: ${weakenGrowThread} -----`);

    // Weaken 1 -> Negate Hack Effect
    ns.exec("batch_algorithm/weaken.js", hostServer, weakenHackThread, targetServer);
    await ns.sleep(200);

    // Weaken 2 -> Negate Grow Effect
    if (weakenGrowThread > 0) {
      ns.exec("batch_algorithm/weaken.js", hostServer, weakenGrowThread, targetServer);
      await ns.sleep(wknTime - grwTime - 100);
    }

    // Grow Process
    if (growThread > 0) {
      ns.exec("batch_algorithm/grow.js", hostServer, growThread, targetServer);
      await ns.sleep(grwTime - hckTime - 150);
    }

    // Hack Process
    ns.exec("batch_algorithm/hack.js", hostServer, hackThread, targetServer);
  }


  // While initial money is zero, grow to ensure thread count > 1
  while (ns.getServerMoneyAvailable(targetServer) < 1) {
    await ns.grow(targetServer);
  }

  while (true) {
    // Prep Loop
    ns.print("-----Entering Prepping Phase-----")
    while (ns.getServerMoneyAvailable(targetServer) < targetServerMaxMoney || ns.getServerSecurityLevel(targetServer) > minSecurityLevel) {
      // Execute Prep Loop if current RAM usage is less than 95% Max RAM
      if (ns.getServerUsedRam(hostServer) < 0.95 * ns.getServerMaxRam(hostServer)) {
        await prepLoop();
        await ns.sleep(200);
      } else {
        await ns.sleep(100);
      }
    }

    // Hack Weaken Grow Weaken (HWGW) Loop
    ns.print("-----Entering Batching Phase-----")
    while (ns.getServerMoneyAvailable(targetServer) >= (targetServerMaxMoney * 0.65)) {
      // Execute Batching if current RAM usage is less than 95% Max RAM
      if (ns.getServerUsedRam(hostServer) < 0.95 * ns.getServerMaxRam(hostServer)) {
        await mainLoop();
        await ns.sleep(200);
      } else {
        await ns.sleep(100);
      }
    }
  }

}