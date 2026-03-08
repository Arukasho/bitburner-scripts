/** @param {NS} ns */
export async function main(ns) {
  const utilizedServers = [
    "iron-gym",
    "CSEC",
    "zer0",
    "max-hardware",
    "neo-net",
  ];

  const target = "n00dles";
  const usedScript = "contained_algorithm/self-contained-algorithm.js";
  const ramUsed = 2.6 // RAM usage per script (in GB)

  // Hold the script process until BruteSSH.exe is obtained
  while (!ns.fileExists("BruteSSH.exe")) {
    ns.tprint("BruteSSH.exe doesn't exist. Buy or create BruteSSH.exe to continue script process.")
    await ns.sleep(60000)
  }

  // Brute and Nuke the target if root access is false 
  if (!ns.hasRootAccess(target)) {
    ns.brutessh(target);
    ns.nuke(target);
  }
  
  for (let i = 0; i < utilizedServers.length; ++i) {
    const serv = utilizedServers[i];

    // Calculate max thread per server
    let maxServerRAM = ns.getServerMaxRam(serv);
    let maxThread = Math.floor(maxServerRAM / ramUsed);
    
    // Brute and Nuke the server if root access is false 
    if (!ns.hasRootAccess(serv)) {
      ns.brutessh(serv);
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