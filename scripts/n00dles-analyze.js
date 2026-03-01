/** @param {NS} ns */
export async function main(ns) {
  /* This script is dedicated to analyze the server "n00dles" */
  const target = "max-hardware";
  const targetMaxMoney = ns.getServerMaxMoney(target);
  const targetInitCurrentMoney = ns.getServerMoneyAvailable(target);
  const initgrowMultiplier = targetMaxMoney / targetInitCurrentMoney;
  const numCores = 2; //home server current number of cores

  /* Initial difference between current money and maximum money on a server. */
  const initMoneyGap = targetMaxMoney - targetInitCurrentMoney;
  
  /**Calculate the number of grow 
  threads needed for a given multiplicative growth factor.**/
  const initGrowThread = ns.growthAnalyze(target, initgrowMultiplier, numCores);
  ns.tprint(`Initial grow thread: ${initGrowThread}`);

  /**Calculate the security 
  increase for a number of grow threads."**/
  const initGrowSecurityIncrease = ns.growthAnalyzeSecurity(initGrowThread, target, numCores);
  ns.tprint(`Initial security increase after init grow: ${initGrowSecurityIncrease}`);

  /* I need to find out the best amount of threads to allocate to get close to
  the minimum security level */
  let weakenThread = 20; // 1.06 points decrease. Weaken after hack.
  const weakenAnalysis = ns.weakenAnalyze(weakenThread, numCores);
  const initSecurityLevel = 1; // hardcoded
  const minSecurityLevel = 1; // hardcoded
  const secDiff = initSecurityLevel - minSecurityLevel;

  const moneyPerThread = (ns.hackAnalyze(target) * 100).toFixed(2); 
  const moneyToStealPerBatch = 60; // In Percent
  const hackThreadNumber = Math.ceil(moneyToStealPerBatch / moneyPerThread); // Equals to 118 for n00dles

  /**Get the security increase or a number of threads.**/
  const hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreadNumber, target);

  ns.tprint(`Security decrease with ${weakenThread} number of threads of weaken: ${weakenAnalysis}`);
  ns.tprint(`Money stolen per thread: ${moneyPerThread}%`);
  ns.tprint(`Security inrease with ${hackThreadNumber} number of threads of hack: ${hackSecurityIncrease}`);
  

  // weaken --> security from init to min
  // grow --> from init to max

  // LOOP;;;;;
  // weaken --> security from after-grow to min
  // hack --> 30% or 60%
  // weaken --> from after-hack to min
  // grow --> from after-hack to max

}