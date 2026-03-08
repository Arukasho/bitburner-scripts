/** @param {NS} ns */
export async function main(ns) {
  const servers1Port = [
    "iron-gym",
    "CSEC",
    "zer0",
    "max-hardware",
    "neo-net",
  ];

  for (let i = 0; i < servers1Port.length; ++i) {
    const serv = servers1Port[i];
    ns.brutessh(serv);
    ns.nuke(serv);
  }

}