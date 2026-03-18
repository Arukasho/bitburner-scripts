/** @param {NS} ns */
export async function main(ns) {
  const utilizedServers = [
    "phantasy",
    "silver-helix",
    "omega-net",
    "the-hub",
    "johnson-ortho",
    "crush-fitness",
    "avmnite-02h",
  ];

  const target = "joesguns";
  const usedScript = "contained_algorithm/self-contained-algorithm.js";
  const ramUsed = 2.6 // RAM usage per script (in GB)

  // Hold the script process until BruteSSH.exe is obtained
  while (!ns.fileExists("BruteSSH.exe")) {
    ns.tprint("BruteSSH.exe doesn't exist. Buy or create BruteSSH.exe to continue script process.")
    await ns.sleep(60000)
  }

  // Hold the script process until BruteSSH.exe is obtained
  while (!ns.fileExists("FTPCrack.exe")) {
    ns.tprint("FTPCrack.exe.exe doesn't exist. Buy or create relaySMTP.exe to continue script process.")
    await ns.sleep(60000)
  }

  // Brute and Nuke the target if root access is false 
  if (!ns.hasRootAccess(target)) {
    ns.brutessh(target);
    ns.ftpcrack(target);
    ns.nuke(target);
  }
  
  for (let i = 0; i < utilizedServers.length; ++i) {
    const serv = utilizedServers[i];

    // Calculate max thread per server
    let maxServerRAM = ns.getServerMaxRam(serv);
    let maxThread = Math.max(Math.floor(maxServerRAM / ramUsed), 1);
    
    // Brute and Nuke the utilized servers if root access is false 
    if (!ns.hasRootAccess(serv)) {
      ns.brutessh(serv);
      ns.ftpcrack(serv);
      ns.nuke(serv);
    }

    if (!ns.fileExists(usedScript, serv)) {
      ns.scp(usedScript, serv);
    }

    if (!ns.scriptRunning(usedScript, serv)) {
      ns.exec(usedScript, serv, maxThread, target);
    }

  }
}