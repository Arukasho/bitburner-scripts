/** @param {NS} ns */
export async function main(ns) {
  /* This script is dedicated to analyze the server "phantasy" */
  const target = "phantasy";
  const targetMaxMoney = ns.getServerMaxMoney(target);
  const targetInitCurrentMoney = ns.getServerMoneyAvailable(target);
  const initgrowMultiplier = targetMaxMoney / targetInitCurrentMoney;
  const numCores = 2; //home server current number of cores
  const initGrowThread = ns.growthAnalyze(target, initgrowMultiplier, numCores);
  const initGrowSecurityIncrease = ns.growthAnalyzeSecurity(initGrowThread, target, numCores);
  
  /* I need to find out the best amount of threads to allocate to get close to
  the minimum security level */
  let weakenThread = 250; // 13 points decrease. Initial weaken thread.
  const weakenAnalysis = ns.weakenAnalyze(weakenThread, numCores);
  const initSecurityLevel = 20; // hardcoded
  const minSecurityLevel = 7; // hardcoded
  const secDiff = initSecurityLevel - minSecurityLevel;

  /* Loop until weakenThread get to the amount that would decrease security level from
  initial level to close to the minimum level 
  while (weakenAnalysis < secDiff) {
    weakenThread += 1;
    }; 
    
    */

  const hackThreadNumber = Math.ceil(ns.hackAnalyzeThreads(target, targetMaxMoney * 0.4));
  const hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreadNumber, target);
  const moneyPerThread = ns.hackAnalyze(target);
  const hackThreadsteal60 = 207; // Calculated myself

  ns.tprint(`Security decrease with ${weakenThread} number of threads of weaken: ${weakenAnalysis}`);
  ns.tprint(`Money stolen per thread: ${(moneyPerThread * 100).toFixed(2)}%`);  
  ns.tprint(`Security inrease with ${hackThreadNumber} number of threads of hack: ${hackSecurityIncrease}`);
  

}