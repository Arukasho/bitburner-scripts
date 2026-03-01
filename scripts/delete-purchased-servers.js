/** @param {NS} ns */
export async function main(ns) {

  const myServers = ns.getPurchasedServers();
  const scriptUsed = "hack-server.js"

  for (let server of myServers) {
    ns.scriptKill(scriptUsed, server);
    ns.deleteServer(server);
  }

}