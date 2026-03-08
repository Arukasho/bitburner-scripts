/** @param {NS} ns */
export async function main(ns) {
  const ram = ns.args[0]; 
  const ramPrice = ns.getPurchasedServerCost(ram);
  ns.tprint(`A server with ${ram} GB RAM would cost: ${ramPrice/1000000}M.`) 
  // ns.purchaseServer("myserver-" + i, ram);

}