/** @param {NS} ns */
export async function main(ns) {
  const servers2Port = [
    "phantasy",
    "silver-helix",
    "omega-net",
    "the-hub",
    "johnson-ortho",
    "crush-fitness",
  ];

  for (let i = 0; i < servers2Port.length; ++i) {
    const serv = servers2Port[i];

    ns.brutessh(serv);
    ns.ftpcrack(serv);
    ns.nuke(serv);
  }

}