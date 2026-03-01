/** @param {NS} ns */
export async function main(ns) {
  // Get array of purchased server hostnames
  let purchasedServers = ns.getPurchasedServers();
    
  // Get the count
  let pservCount = purchasedServers.length;
  
  const ram = 4096 * 4;
  const ramPrice = ns.getPurchasedServerCost(ram);
  // ns.tprint(`A server with ${ram} GB RAM would cost: ${ramPrice/1000000}M.`) 
  ns.purchaseServer("pserv-" + pservCount, ram);

}