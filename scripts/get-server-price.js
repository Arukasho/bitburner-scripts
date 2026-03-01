/** @param {NS} ns */
export async function main(ns) {
  const purchasedRAM = 8
  ns.tprint(`${purchasedRAM} GB Server's price: ${ns.getPurchasedServerCost(purchasedRAM)}`);

}