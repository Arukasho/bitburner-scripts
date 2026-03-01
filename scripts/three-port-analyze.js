/** @param {NS} ns */
export async function main(ns) {
  const servers3port = [
    "computek",
    "netlink",
    "rothman-uni",
    "catalyst",
    "summit-uni",
    "I.I.I.I",
    "rho-construction",
    "millenium-fitness",
  ];

  ns.tprint(`****** Servers with 3 ports connection ******`)
  for (let i = 0; i < servers3port.length; i++) {
    ns.tprint(`------ No: ${i + 1} ------`)
    ns.tprint(`Server's name: ${servers3port[i]}`)
    ns.tprint(`Root access: ${ns.hasRootAccess(servers3port[i])}`);
    ns.tprint(`Hack level: ${ns.getServerRequiredHackingLevel(servers3port[i])}`);
    ns.tprint(`Max Money: ${(ns.getServerMaxMoney(servers3port[i]) / 1000000).toFixed(2)}M`);
    ns.tprint(`Hack Chance: ${(ns.hackAnalyzeChance(servers3port[i]) * 100).toFixed(2)}%`);
    ns.tprint(`Hack Time: ${(ns.getHackTime(servers3port[i]) / 1000).toFixed(2)}s`);
    ns.tprint(`Grow Time: ${(ns.getGrowTime(servers3port[i]) / 1000).toFixed(2)}s`);
    ns.tprint(`Weaken Time: ${(ns.getWeakenTime(servers3port[i]) / 1000).toFixed(2)}s`);
  }

}