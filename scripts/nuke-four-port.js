/** @param {NS} ns */
export async function main(ns) {
  const servers4Port = [
    "syscore", "alpha-ent",
    "aevum-police",
    "lexo-corp",
    "snap-fitness",
    "global-pharm",
    "unitalife",
    "univ-energy",
    "zb-def",
    "nova-med",
    "applied-energetics",
    "run4theh111z",
    ".",
  ];

  for (let i = 0; i < servers4Port.length; ++i) {
    const serv = servers4Port[i];
    
    ns.brutessh(serv);
    ns.ftpcrack(serv);
    ns.relaysmtp(serv);
    ns.httpworm(serv);
    ns.nuke(serv);
  }

}