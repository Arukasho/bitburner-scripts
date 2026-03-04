/** @param {NS} ns */
export async function main(ns) {
  const servers5Port = [
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

  for (let i = 0; i < servers5Port.length; ++i) {
    const serv = servers5Port[i];
    
    ns.brutessh(serv);
    ns.ftpcrack(serv);
    ns.relaysmtp(serv);
    ns.httpworm(serv);
    ns.sqlinject(serv);
    ns.nuke(serv);
  }

}