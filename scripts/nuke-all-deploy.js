/** @param {NS} ns */
export async function main(ns) {

  const nukeScripts = [
    "nuke-zero-port.js",
    "nuke-one-port.js",
    "nuke-two-port.js",
    "nuke-three-port.js",
    "nuke-four-port.js",
    "nuke-five-port.js",
    ]

  ns.exec(nukeScripts[0], "home", 1);

  while (!ns.fileExists("BruteSSH.exe")) {
        await ns.sleep(10000);
  }
  
  ns.exec(nukeScripts[1], "home", 1);

  while (!ns.fileExists("FTPCrack.exe")) {
        await ns.sleep(10000);
  }

  ns.exec(nukeScripts[2], "home", 1);

  while (!ns.fileExists("relaySMTP.exe")) {
        await ns.sleep(10000);
  }

  ns.exec(nukeScripts[3], "home", 1);

  while (!ns.fileExists("HTTPWorm.exe")) {
        await ns.sleep(10000);
  }

  ns.exec(nukeScripts[4], "home", 1);

  while (!ns.fileExists("SQLInject.exe")) {
        await ns.sleep(10000);
  }

  ns.exec(nukeScripts[5], "home", 1);

}