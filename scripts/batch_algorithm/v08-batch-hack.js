/** @param {NS} ns */
export async function main(ns) {

  // Assign servers variables
  const hostServer = ns.args[0]; // host to run HGW scripts from
  const targetServer = ns.args[1]; // target server to hack money from

  // If any of the arguments are empty, inform user how to call the script
  // To call script from terminal --> run script-name.js host-server-name target-server-name
  if (hostServer === undefined || targetServer === undefined) {
    ns.tprint("To call script from terminal --> run script-name.js host-server-name target-server-name")
    return;
  }

  // HGW scripts Array
  const scriptsHGW = [
    "batch_algorithm/hack.js",
    "batch_algorithm/grow.js",
    "batch_algorithm/weaken.js",
  ]

  // Gain root access of target server if not yet available 
  const programs = ["BruteSSH", "FTPCrack", "relaySMTP", "HTTPWorm", "SQLInject"];
  let numPorts = ns.getServerNumPortsRequired(targetServer);

  for (let i = 0; i < numPorts; i++) {
    ns[programs[i]](targetServer);
  }
  ns.nuke(targetServer);


  // If any of the HGW scripts does not exist on host server, copy all HGW scripts from home to the host server
  if (!ns.fileExists(scriptsHGW[0], hostServer)) {
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

  async function prepLoop(prepCounter) {
    let wknTime = ns.getWeakenTime(targetServer);
    let grwTime = ns.getGrowTime(targetServer);

    // Find out how many threads the host sever can handle
    let hostMaxRAM = ns.getServerMaxRam(hostServer);
    let hostUsedRAM = ns.getServerUsedRam(hostServer);
    let hostAvailableRAM = hostMaxRAM - hostUsedRAM;
    let scriptRAMUsage = Math.max(ns.getScriptRam(scriptsHGW[1]), ns.getScriptRam(scriptsHGW[2])); // Script with most RAM usage
    let hostServerCapacity = Math.floor(hostAvailableRAM / scriptRAMUsage); // How many threads the prep host can handle
    
    // Grow thread count
    let growThreadToUse = getPrepGrowThread();
    let weakenThreadToUse = getAfterGrowWeakenThread(growThreadToUse);
    
    let reducer = 1;

    // If weaken and grow thread is more than host server capacity
    // Reiterate thread calculation until weaken+grow < host capacity
    if (weakenThreadToUse + growThreadToUse > hostServerCapacity) {
      while (weakenThreadToUse + growThreadToUse > hostServerCapacity) {
        growThreadToUse = Math.floor(hostServerCapacity * reducer);
        weakenThreadToUse = getAfterGrowWeakenThread(growThreadToUse);
        reducer -= 0.1; // reducer could get below zero and results in negative thread
      }
      await ns.sleep(1000);
    }
    // Weaken Thread could become 0 because of the reducing iteration
    // I think it's okay to execute grow script even when weaken doesn't execute
    // But for the next prep cycle, security increase from current grow script must be accounted for
    // But how?

    ns.print(`----- Prep Grow: ${growThreadToUse} Prep Weaken: ${weakenThreadToUse} -----`);

    // Execute grow when grow thread count more than 0
    let pid1 = 0;
    if (weakenThreadToUse > 0) {
      pid1 = ns.exec(scriptsHGW[2], hostServer, weakenThreadToUse, targetServer);
      await ns.sleep(wknTime - grwTime - 20);
    } 

    // Execute grow when grow thread count more than 0 
    // and weaken script of current cycle successfully executed
    let pid2 = 0;
    if (growThreadToUse > 0 && getPrepSecurityDifference() < 5) {
      pid2 = ns.exec(scriptsHGW[1], hostServer, growThreadToUse, targetServer);
    } 
    
    // Script Execution Logging
    let pid1Status = pid1 === 1 ? `Weaken cycle No.${prepCounter-1} successfully executed` : 
    `Weaken cycle No.${prepCounter-1} not executed (weaken thread count = 0)`;
    let pid2Status = pid2 === 1 ? `Grow cycle No.${prepCounter-1} successfully executed` : 
    `Grow cycle No.${prepCounter-1} not executed (grow thread count = 0 or security too high)`;

    ns.print(`*** ${pid1Status} ***`);
    ns.print(`*** ${pid2Status} ***`);
    ns.print(`*** Reducer: ${reducer} ***`)

  }

  async function mainLoop(batchCounter) {
    let wknTime = ns.getWeakenTime(targetServer);
    let hckTime = ns.getHackTime(targetServer);
    let grwTime = ns.getGrowTime(targetServer);

    // Find out how many threads host sever can handle
    let hostMaxRAM = ns.getServerMaxRam(hostServer);
    let hostUsedRAM = ns.getServerUsedRam(hostServer);
    let hostAvailableRAM = hostMaxRAM - hostUsedRAM;
    let scriptRAMUsage = Math.max(ns.getScriptRam(scriptsHGW[0]), ns.getScriptRam(scriptsHGW[1]), ns.getScriptRam(scriptsHGW[2])) ; // Script with most RAM usage
    let hostServerCapacity = Math.floor(hostAvailableRAM / scriptRAMUsage); // How many threads the prep host can handle

    let hackThread = getHackThread();
    let hackThreadToUse = hackThread;

    if (hackThreadToUse > hostServerCapacity) {
      hackThreadToUse = Math.floor(hostServerCapacity * 0.5);
    }

    let growThread = getBatchGrowThread(hackThreadToUse);
    let weakenGrowThread = getAfterGrowWeakenThread(growThread);
    let weakenHackThread = getAfterHackWeakenThread(hackThreadToUse);    

    // Wait until sufficient RAM to execute a batch is available
    while (hackThreadToUse+growThread+weakenHackThread+weakenGrowThread > hostServerCapacity) {
        await ns.sleep(1000);
      }

    ns.print(`----- Hack: ${hackThreadToUse} Grow: ${growThread} W1: ${weakenHackThread} W2: ${weakenGrowThread} -----`);

    // Weaken 1 -> Negate Hack Effect
    let pid1 = 0;
    if (hackThreadToUse+growThread+weakenHackThread+weakenGrowThread > hostServerCapacity) {
      pid1 = ns.exec(scriptsHGW[2], hostServer, weakenHackThread, targetServer);
      await ns.sleep(200);
    }

    // Weaken 2 -> Negate Grow Effect
    let pid2 = 0;
    if (weakenGrowThread > 0 && pid1 != 0) {
      pid2 = ns.exec(scriptsHGW[2], hostServer, weakenGrowThread, targetServer);
      await ns.sleep(wknTime - grwTime - 100);
    }

    // Grow Process
    let pid3 = 0;
    if (growThread > 0 && pid2 != 0) {
      pid3 = ns.exec(scriptsHGW[1], hostServer, growThread, targetServer);
      await ns.sleep(grwTime - hckTime - 150);
    }

    // Hack Process
    let pid4 = 0;
    if (pid1 != 0 && pid3 != 0) {
      pid4 = ns.exec(scriptsHGW[0], hostServer, hackThreadToUse, targetServer);
    }

    // Script Execution Logging
    // Script Execution Logging
    let pid1Status = pid1 === 1 ? `W1 cycle No.${batchCounter-1} successfully executed` : 
    `W1 cycle No.${batchCounter-1} not executed (insufficient RAM)`;
    let pid2Status = pid2 === 1 ? `W2 cycle No.${batchCounter-1} successfully executed` : 
    `W2 cycle No.${batchCounter-1} not executed (weaken thread count = 0 or W1 not executed)`;
    let pid3Status = pid3 === 1 ? `Grow cycle No.${batchCounter-1} successfully executed` : 
    `Grow cycle No.${batchCounter-1} not executed (grow thread count = 0 or W2 not executed)`;
    let pid4Status = pid4 === 1 ? `Hack cycle No.${batchCounter-1} successfully executed` : 
    `Hack cycle No.${batchCounter-1} not executed (W1 and Grow not executed)`;

    ns.print(`*** ${pid1Status} ***`);
    ns.print(`*** ${pid2Status} ***`);
    ns.print(`*** ${pid3Status} ***`);
    ns.print(`*** ${pid4Status} ***`);

  }


  // While initial money is zero, grow to ensure thread count > 1
  while (ns.getServerMoneyAvailable(targetServer) < 1) {
    await ns.grow(targetServer);
  }

  // Initiate Counter
  let prepCounter = 0;
  let batchCounter = 0;

  // Base Loop
  while (true) {

    // Prep Loop
    ns.print("----- Entering Prepping Phase -----");
    while (ns.getServerMoneyAvailable(targetServer) < targetServerMaxMoney || ns.getServerSecurityLevel(targetServer) > minSecurityLevel) {
      // Execute Prep Loop if current RAM usage is less than 95% Max RAM
      ns.print(`----- Prep Cycle No. ${prepCounter++} -----`);
      if (ns.getServerUsedRam(hostServer) < 0.95 * ns.getServerMaxRam(hostServer)) {
        await prepLoop(prepCounter);
        await ns.sleep(200);
      } else {
        await ns.sleep(200);
      }
    }

    // Wait for some amount of time to pass before going from prep phase to batching phase
    await ns.sleep(10000);

    // Hack Weaken Grow Weaken (HWGW) Loop
    ns.print("----- Entering Batching Phase -----");
    while (ns.getServerMoneyAvailable(targetServer) >= (targetServerMaxMoney * 0.65)) {
      // Execute Batching if current RAM usage is less than 95% Max RAM
      ns.print(`----- Batch Cycle No. ${batchCounter++} -----`);
      if (ns.getServerUsedRam(hostServer) < 0.95 * ns.getServerMaxRam(hostServer)) {
        await mainLoop(batchCounter);
        await ns.sleep(200);
      } else {
        await ns.sleep(200);
      }
    }
  }

}