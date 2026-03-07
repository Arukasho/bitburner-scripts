/** @param {NS} ns */
export async function main(ns) {
  const ram = 1048576;
  const ramPrice = ns.getPurchasedServerCost(ram);
  ns.tprint(`A server with ${ram} GB RAM would cost: ${ramPrice/1000000}M.`) 
  // ns.purchaseServer("myserver-" + i, ram);

}