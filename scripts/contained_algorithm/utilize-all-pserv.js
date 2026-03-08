/** @param {NS} ns */
export async function main(ns) {
  const utilizedServers = ns.getPurchasedServers();

  const target = "n00dles";
  const usedScript = "contained_algorithm/self-contained-algorithm.js";
  const ramUsed = 2.6 // RAM usage per script (in GB)

  
  for (let i = 0; i < utilizedServers.length; ++i) {
    const serv = utilizedServers[i];

    // Calculate max thread per server
    let availableServerRAM = ns.getServerMaxRam(serv);
    let maxThread = Math.floor(availableServerRAM / ramUsed);
    
    if (!ns.fileExists(usedScript, serv)) {
      ns.scp(usedScript, serv);
    }

    if (!ns.scriptRunning(usedScript, serv)) {
      ns.exec(usedScript, serv, maxThread, target);
    }

  }
}