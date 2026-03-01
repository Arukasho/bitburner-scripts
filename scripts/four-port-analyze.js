/** @param {NS} ns */
export async function main(ns) {
  const servers4port = [
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

  ns.tprint(`****** Servers with 4 ports connection ******`)
  for (let i = 0; i < servers4port.length; i++) {
    ns.tprint(`------ No: ${i + 1} ------`)
    ns.tprint(`Server's name: ${servers4port[i]}`)
    ns.tprint(`Root access: ${ns.hasRootAccess(servers4port[i])}`);
    ns.tprint(`Hack level: ${ns.getServerRequiredHackingLevel(servers4port[i])}`);
    ns.tprint(`Max Money: ${(ns.getServerMaxMoney(servers4port[i]) / 1000000).toFixed(2)}M`);
    ns.tprint(`Hack Chance: ${(ns.hackAnalyzeChance(servers4port[i]) * 100).toFixed(2)}%`);
    ns.tprint(`Hack Time: ${(ns.getHackTime(servers4port[i]) / 1000).toFixed(2)}s`);
    ns.tprint(`Grow Time: ${(ns.getGrowTime(servers4port[i]) / 1000).toFixed(2)}s`);
    ns.tprint(`Weaken Time: ${(ns.getWeakenTime(servers4port[i]) / 1000).toFixed(2)}s`);
  }

}