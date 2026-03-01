/** @param {NS} ns */
export async function main(ns) {
  const servers0Port = [
    "n00dles",
    "foodnstuff",
    "sigma-cosmetics",
    "joesguns",
    "hong-fang-tea",
    "harakiri-sushi",
    "nectar-net",
  ];

  for (let i = 0; i < servers0Port.length; ++i) {
    const serv = servers0Port[i];
    ns.nuke(serv);
  }

}