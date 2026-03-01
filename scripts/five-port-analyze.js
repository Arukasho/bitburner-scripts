/** @param {NS} ns */
export async function main(ns) {
  const servers5port = [
    "darkweb",
    "zb-institute",
    "galactic-cyber",
    "aerocorp",
    "omnia",
    "deltaone",
    "zeus-med",
    "defcomm",
    "solaris",
    "icarus",
    "taiyang-digital",
    "infocomm",
    "titan-labs",
    "microdyne",
    "fulcrumtech",
    "vitalife",
    "helios",
    "stormtech",
    "kuai-gong",
    "omnitek",
    "4sigma",
    "clarkinc",
    "powerhouse-fitness",
    "b-and-a",
    "blade",
    "nwo",
    "fulcrumassets",
    "ecorp",
    "The-Cave",
    "megacorp",
  ];

  ns.tprint(`****** Servers with 5 ports connection ******`)
  for (let i = 0; i < servers5port.length; i++) {
    ns.tprint(`------ No: ${i + 1} ------`)
    ns.tprint(`Server's name: ${servers5port[i]}`)
    ns.tprint(`Root access: ${ns.hasRootAccess(servers5port[i])}`);
    ns.tprint(`Hack level: ${ns.getServerRequiredHackingLevel(servers5port[i])}`);
    ns.tprint(`Max Money: ${(ns.getServerMaxMoney(servers5port[i]) / 1000000).toFixed(2)}M`);
    ns.tprint(`Hack Chance: ${(ns.hackAnalyzeChance(servers5port[i]) * 100).toFixed(2)}%`);
    ns.tprint(`Hack Time: ${(ns.getHackTime(servers5port[i]) / 1000).toFixed(2)}s`);
    ns.tprint(`Grow Time: ${(ns.getGrowTime(servers5port[i]) / 1000).toFixed(2)}s`);
    ns.tprint(`Weaken Time: ${(ns.getWeakenTime(servers5port[i]) / 1000).toFixed(2)}s`);
  }

}