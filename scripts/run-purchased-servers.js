/** @param {NS} ns */
export async function main(ns) {
  let i = 0;
  const scriptUsed = "hack-server.js";
  const myServers = ns.getPurchasedServers();

  while (i < myServers.length) {
    
    let hostname = myServers[i];

    const ram = ns.getServerMaxRam(hostname);
    const scriptRam = ns.getScriptRam(scriptUsed);
    const threads = Math.floor(ram / scriptRam);

    if (threads > 0) {
      ns.scp(scriptUsed, hostname);
      ns.exec(scriptUsed, hostname, threads);
      }
      
    ++i;
    }
}