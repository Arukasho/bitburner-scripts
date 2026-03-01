/** @param {NS} ns */
export async function main(ns) {
  // Specify target server
  const host = "home"; 
  const target = "n00dles";

  // Execute NUKE.exe if root access is false
  if (!ns.hasRootAccess(target)) {
    ns.nuke(target);
  }

  // Initial server preparation before hacking attempt (min security and max money)
  /* ns.exec("weaken.js", host, 20, target);
  await ns.sleep(70000);
  ns.exec("grow.js", host, 30, target);
  await ns.sleep(56000); */
  
  while (true) {
    ns.exec("weaken.js", host, 20, target);
    await ns.sleep(70000);
    ns.exec("hack.js", host, 118, target);
    await ns.sleep(18000);
    ns.exec("weaken.js", host, 20, target);
    await ns.sleep(70000);
    ns.exec("grow.js", host, 30, target);
    await ns.sleep(56000);
  }

}