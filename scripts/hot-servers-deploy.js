/** @param {NS} ns */
export async function main(ns) {
  const hackScript = "v06-batch-hack.js";
  const scriptRunServer = "home";
  const numOfBatch = 10;

  const hotServers = [
    "foodnstuff",
    "max-hardware",
    "silver-helix",
    "phantasy",
    "rho-construction",
    "alpha-ent",
    "snap-fitness",
    "4sigma",
    "clarkinc",
    "ecorp",
    "megacorp",
  ]
 
  for (let server of hotServers) {
    if (ns.hasRootAccess(server) && ns.getHackingLevel() > ns.getServer.requiredHackingSkill) {
      for (let i = 0; i < numOfBatch; i++) {
        ns.exec(hackScript, scriptRunServer, 1, scriptRunServer, server);
        await ns.sleep(200);
      }
    } else {
      while (!ns.hasRootAccess(server) || ns.getHackingLevel() < ns.getServer.requiredHackingSkill) {
        await ns.sleep(10000);
      }
      for (let i = 0; i < numOfBatch; i++) {
        ns.exec(hackScript, scriptRunServer, 1, scriptRunServer, server);
        await ns.sleep(200);
      }
    }
  }
}