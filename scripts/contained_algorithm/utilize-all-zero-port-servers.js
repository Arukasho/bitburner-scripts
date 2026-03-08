/** @param {NS} ns */
export async function main(ns) {
  const utilizedServers = [
    "foodnstuff",
    "joesguns",
    "sigma-cosmetics",
    "hong-fang-tea",
    "harakiri-sushi",
    "nectar-net",
  ];

  const target = "n00dles";
  const usedScript = "contained_algorithm/self-contained-algorithm.js";
  const ramUsed = 2.6 // RAM usage per script (in GB)


  // Nuke the target if root access is false 
  if (!ns.hasRootAccess(target)) {
    ns.nuke(target);
  }
  
  for (let i = 0; i < utilizedServers.length; ++i) {
    const serv = utilizedServers[i];

    // Calculate max thread per server
    let maxServerRAM = ns.getServerMaxRam(serv);
    let maxThread = Math.floor(maxServerRAM / ramUsed);
    
    // Nuke the server if root access is false 
    if (!ns.hasRootAccess(serv)) {
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