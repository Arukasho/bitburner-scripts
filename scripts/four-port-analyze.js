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
    const serv = servers4port[i];
    const maxMoney = (ns.getServerMaxMoney(serv) / 1000000).toFixed(2);
    const currMoney = (ns.getServerMoneyAvailable(serv) / 1000000).toFixed(2);
    const hckTime = (ns.getHackTime(serv) / 1000).toFixed(2);
    const grwTime = (ns.getGrowTime(serv) / 1000).toFixed(2);
    const wknTime = (ns.getWeakenTime(serv) / 1000).toFixed(2);
    const servSecurity = ns.getServerSecurityLevel(serv);
    const minSecurity = ns.getServerMinSecurityLevel(serv);

    ns.tprint(`------ No: ${i + 1} ------`)
    ns.tprint(`Server's name: ${serv}`)
    ns.tprint(`Root access: ${ns.hasRootAccess(serv)}`);
    ns.tprint(`Max Money: ${maxMoney}M`);
    ns.tprint(`Current Money: ${currMoney}M`);
    ns.tprint(`Security Level: ${servSecurity}`);
    ns.tprint(`Minimum Security Level: ${minSecurity}`);
    ns.tprint(`Hack level: ${ns.getServerRequiredHackingLevel(serv)}`);
    ns.tprint(`Hack Chance: ${(ns.hackAnalyzeChance(serv) * 100).toFixed(2)}%`);
    ns.tprint(`Hack Time: ${hckTime}s`);
    ns.tprint(`Grow Time: ${grwTime}s`);
    ns.tprint(`Weaken Time: ${wknTime}s`);
  }

}