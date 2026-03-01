/** @param {NS} ns */
export async function main(ns) {
  // This script assumes root access to target is true. 

  // Initial Parameters
  const host = "home";
  const target = "max-hardware";
  const targetMaxMoney = ns.getServerMaxMoney(target);
  let targetCurrentMoney = ns.getServerMoneyAvailable(target);
  let growMultiplier = targetMaxMoney / targetCurrentMoney;
  let numCores = 2; //home server current number of cores

  /*
  // Debug section
  ns.tprint(`Current Money: ${targetCurrentMoney}`);
  ns.tprint(`Max Money: ${targetMaxMoney}`);
  ns.tprint(`Grow Multiplier: ${growMultiplier}`);
  */

  /* Calculate the number of grow 
  threads needed for a given multiplicative growth factor. */
  let growThread = Math.ceil(ns.growthAnalyze(target, growMultiplier, numCores));
  
  // Debug section
  // ns.tprint(`Grow Thread: ${growThread}`);

  /* Calculate the security 
  increase for a number of grow threads." */
  // let growSecurityIncrease = ns.growthAnalyzeSecurity(growThread, target, numCores);

  /* Find out the best amount of threads to allocate to get close to
  the minimum security level */
  let weakenEffectPerThread = ns.weakenAnalyze(1, numCores);
  let securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
  const minSecurityLevel = ns.getServerMinSecurityLevel(target);
  let securityDifference = securityLevel - minSecurityLevel;
  let weakenThread = Math.ceil(securityDifference / weakenEffectPerThread);

  // Get hack thread number
  let moneyPerThread = (ns.hackAnalyze(target) * 100).toFixed(2);
  const moneyToStealPerBatch = 20; // In Percent
  let hackThread = Math.ceil(moneyToStealPerBatch / moneyPerThread);

  // Get weaken time, grow time and hack time
  let hckTime = ns.getHackTime(target);
  let grwTime = ns.getGrowTime(target);
  let wknTime = ns.getWeakenTime(target);

  /*
  // Debug section
  ns.tprint(`Weaken Thread: ${weakenThread}`);
  ns.tprint(`Grow Thread: ${growThread}`);
  ns.tprint(`Hack Thread: ${hackThread}`);
  */

  // Get the security increase or a number of threads.
  // let hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThread, target);
  
  // Initial server preparation before hacking attempt (min security and max money)

  // If initial money is zero, grow to ensure thread count > 1
  if (targetCurrentMoney < 1) {
    await ns.grow(target);
    targetCurrentMoney = ns.getServerMoneyAvailable(target);
    growMultiplier = targetMaxMoney / targetCurrentMoney;
    growThread = Math.ceil(ns.growthAnalyze(target, growMultiplier, numCores));
  }

  // Loop condition = Current money is less than the amount to be stolen per batch times 3 and when grow Thread is more than 1000
  while (targetCurrentMoney < (targetMaxMoney * ((moneyToStealPerBatch * 3) / 100)) && growThread > 1000) {
    // weaken parameters refresh
    weakenEffectPerThread = ns.weakenAnalyze(1, numCores);
    securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
    securityDifference = securityLevel - minSecurityLevel;
    weakenThread = Math.ceil(securityDifference / weakenEffectPerThread);
    wknTime = ns.getWeakenTime(target);
    
    // weaken --> security from init to min
    if (securityDifference >= 1) {
      ns.exec("weaken.js", host, weakenThread, target);
      await ns.sleep(wknTime);
    }

    // grow parameters refresh
    targetCurrentMoney = ns.getServerMoneyAvailable(target);
    growMultiplier = targetMaxMoney / targetCurrentMoney;
    growThread = Math.ceil(ns.growthAnalyze(target, growMultiplier, numCores));
    grwTime = ns.getGrowTime(target);

    // grow --> from init to max
    // initial grow thread reduced until server gets to max money 
    if (growThread > 1) {
      ns.exec("grow.js", host, Math.ceil(growThread/4), target);
      await ns.sleep(grwTime);
    }
  }

  // Main batch loop
  while (true) {
    // weaken thread refresh
    weakenEffectPerThread = ns.weakenAnalyze(1, numCores);
    securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
    securityDifference = securityLevel - minSecurityLevel;
    weakenThread = Math.ceil(securityDifference / weakenEffectPerThread);
    wknTime = ns.getWeakenTime(target);

    // weaken --> security from after-grow to min
    if (securityDifference >= 1) {
      ns.exec("weaken.js", host, weakenThread, target);
      await ns.sleep(wknTime);
    }

    // hack parameters refresh
    moneyPerThread = (ns.hackAnalyze(target) * 100).toFixed(2);
    hackThread = Math.ceil(moneyToStealPerBatch / moneyPerThread);
    hckTime = ns.getHackTime(target);

    // hack a certain percentage of the server's max money
    ns.exec("hack.js", host, hackThread, target);
    await ns.sleep(hckTime);

    // weaken parameters refresh
    weakenEffectPerThread = ns.weakenAnalyze(1, numCores);
    securityLevel = Math.ceil(ns.getServerSecurityLevel(target));
    securityDifference = securityLevel - minSecurityLevel;
    weakenThread = Math.ceil(securityDifference / weakenEffectPerThread);
    wknTime = ns.getWeakenTime(target);

    // weaken --> from after-hack to min
    if (securityDifference >= 1) {
      ns.exec("weaken.js", host, weakenThread, target);
      await ns.sleep(wknTime);
    }

    // grow parameters refresh
    targetCurrentMoney = ns.getServerMoneyAvailable(target);
    growMultiplier = targetMaxMoney / targetCurrentMoney;
    growThread = Math.ceil(ns.growthAnalyze(target, growMultiplier, numCores));
    grwTime = ns.getGrowTime(target);

    // grow --> from after-hack to max
    ns.exec("grow.js", host, growThread, target);
    await ns.sleep(grwTime);
  }
  
}