/** @param {NS} ns */
export async function main(ns) {
  // Create an array of purchased server names
  let purchasedServers = ns.getPurchasedServers();
    
  // Count the amount of purchased server
  let pservCount = purchasedServers.length;
  
  
  const ram = 32768*2;
  const ramPrice = ns.getPurchasedServerCost(ram);
  // ns.tprint(`A server with ${ram} GB RAM would cost: ${ramPrice/1000000}M.`) 
  ns.purchaseServer("pserv-" + pservCount, ram);

}