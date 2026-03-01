/** @param {NS} ns */
export async function main(ns) {
  let i = 1;
  const ram = 4096 * 4;
  const ramPrice = ns.getPurchasedServerCost(ram);
  ns.tprint(`A server with ${ram} GB RAM would cost: ${ramPrice/1000000}M.`) 
  // ns.purchaseServer("myserver-" + i, ram);

}