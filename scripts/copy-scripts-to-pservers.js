/** @param {NS} ns */
export async function main(ns) {
  const scripts = ["weaken.js", "grow.js", "hack.js"];
  const pServers = ns.getPurchasedServers();

  for (let i = 0; i < pServers.length; i++) {
    for (let j = 0; j < scripts.length; j++) {
      ns.scp(scripts[j], pServers[i], "home");
    }
  }

}