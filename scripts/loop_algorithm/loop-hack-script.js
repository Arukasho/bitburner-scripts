/** @param {NS} ns */
export async function main(ns) {
  // Host server where the hack, grow and weaken scripts are run
  const hostServer = "pserv-0";
  const availableServerRAM = ns.getServerMaxRam(hostServer) - 3.5; // Max server minus the RAM requirement of this deployer script

  // Target server. The script must be run from terminal with target server as argument
  const targetServer = ns.args[0];

  // Hack, Grow and Weaken thread allocation ratio
  const hackPart = 1;
  const growPart = 10;
  const weakenPart = 2;

  // Sum of HGW Parts
  const sumPart = hackPart + growPart + weakenPart;

  // Hack and weaken script to be used for prepping 
  const prepGrowScript = "loop_algorithm/just-grow.js";
  const prepWeakenScript = "loop_algorithm/just-weaken.js";

  // Which hack, grow and weaken script to be used
  const hackScript = "loop_algorithm/hack-loop.js";
  const growScript = "loop_algorithm/grow-loop.js";
  const weakenScript = "loop_algorithm/weaken-loop.js";

  // Calculate max thread capacity of the server
  // Because all HGW scripts cost the same
  // Just choose one for the calculation
  const ramPerScript = 1.8;
  const maxScriptOnServer = Math.floor(availableServerRAM / ramPerScript);

  // Calculate threads needed for each scripts based on HGW ratio and max script on server
  let hackThread = Math.floor((hackPart / sumPart) * maxScriptOnServer);
  let growThread = Math.floor((growPart / sumPart) * maxScriptOnServer);
  let weakenThread = Math.floor((weakenPart / sumPart) * maxScriptOnServer);

  // If thread counts from previous calculation is less than 1, change thread count to 1
  hackThread = hackThread < 1 ? 1 : hackThread
  growThread = growThread < 1 ? 1 : growThread
  weakenThread = weakenThread < 1 ? 1 : weakenThread

  // Get server current and max money
  const maxMoney = ns.getServerMaxMoney(targetServer);
  let currentMoney = ns.getServerMoneyAvailable(targetServer);

  // Get server current and min security
  const minSecurity = ns.getServerMinSecurityLevel(targetServer);
  let currentSecurity = ns.getServerSecurityLevel(targetServer);

  // Get grow and weaken time
  let wknTime = ns.getWeakenTime(targetServer);
  let grwTime = ns.getGrowTime(targetServer);

  // Prep the server to ensure max money and min security before executing scripts loop
  while (currentMoney < maxMoney || currentSecurity > minSecurity) {
    if (currentSecurity > minSecurity) {
      ns.exec(prepWeakenScript, hostServer, maxScriptOnServer, targetServer);
      await ns.sleep(wknTime);
    }
    if (currentMoney < maxMoney) {
      ns.exec(prepGrowScript, hostServer, maxScriptOnServer, targetServer);
      await ns.sleep(grwTime);
    }
  }
  
  // Execute weaken, hack and grow scripts loop on host server
  // Make sure HGW scripts exist on host server before running this script
  ns.exec(weakenScript, hostServer, weakenThread, targetServer);
  await ns.sleep(200);

  ns.exec(hackScript, hostServer, hackThread, targetServer);
  await ns.sleep(200);

  ns.exec(growScript, hostServer, growThread, targetServer);
  await ns.sleep(200);

}