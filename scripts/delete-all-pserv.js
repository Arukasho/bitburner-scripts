/** @param {NS} ns */
export async function main(ns) {

  const myServers = ns.getPurchasedServers();
  const scriptUsed = "contained_algorithm/self-contained-algorithm.js"

  for (let server of myServers) {
    ns.scriptKill(scriptUsed, server);
    ns.deleteServer(server);
  }

}