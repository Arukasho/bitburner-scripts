/** @param {NS} ns */
export async function main(ns) {
  const hackScript = "v061-batch-hack.js";
  const scriptRunServer = "pserv-1";
  const numOfBatch = 500;

  const server = "omega-net"
 
  for (let i = 0; i < numOfBatch; i++) {
    ns.exec(hackScript, scriptRunServer, 1, scriptRunServer, scriptRunServer, server);
    await ns.sleep(200);
  }
}