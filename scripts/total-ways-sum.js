/** @param {NS} ns */
export async function main(ns) {
  function countPartitions(n) {
    let partitions = new Array(n + 1).fill(0);
    partitions[0] = 1;
    for (let i = 1; i < n+1; i++) {
      for (let j = i; j < n+1; j++) {
        partitions[j] += partitions[j-i];
      }
    }
    return partitions[n];
  }
  
  const numberToFindPartitionOf = 56;
  const numberOfWays = countPartitions(numberToFindPartitionOf);
  ns.tprint(`The number of ways to sum ${numberToFindPartitionOf} is ${numberOfWays}.`)

}

// def count_partitions(n):
//     partitions = [0] * (n + 1)
//     partitions[0] = 1
//     for i in range(1, n + 1):
//         for j in range(i, n + 1):
//             partitions[j] += partitions[j - i]
//     return partitions[n]

// n = 56
// total_p = count_partitions(n)
// ans = total_p - 1
// print(f"{total_p=}")
// print(f"{ans=}")