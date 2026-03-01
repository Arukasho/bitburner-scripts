/** @param {NS} ns */
export async function main(ns) {
  const servers3Port = [
    "computek",
    "netlink",
    "rothman-uni",
    "catalyst",
    "summit-uni",
    "I.I.I.I",
    "rho-construction",
    "millenium-fitness",
  ];

  for (let i = 0; i < servers3Port.length; ++i) {
    const serv = servers3Port[i];
    
    ns.brutessh(serv);
    ns.ftpcrack(serv);
    ns.relaysmtp(serv);
    ns.nuke(serv);
  }

}