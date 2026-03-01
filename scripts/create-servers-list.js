/** @param {NS} ns */
export async function main(ns) {
  //scan current server and make an array of adjacent servers
  let servers = ns.scan();
  
  //1. iterate over found adjacent servers
  //2. scan iterated servers make an array of their adjacent servers
  //3. iterate over newly found adjacent servers
  //4. if the iterated server is not in the original servers array, push it into the array 
  for (let server of servers) {
    let newServers = ns.scan(server);
    for (let newServer of newServers) {
      if (!servers.includes(newServer)) {
        servers.push(newServer);
      }
    }
  }
  //filter the servers array to exclude home and purchased servers
  servers = servers.filter(item => !item.includes("myserver"));
  servers = servers.filter(item => !item.includes("home"));

  //iterate through found server names array
  //print server's max money and hack chance to the terminal
  let servers0Port = [];
  let servers1Port = [];
  let servers2Port = [];
  let servers3Port = [];
  let servers4Port = [];
  let servers5Port = [];

  for (let server of servers) {
    let serverPortRequired = ns.getServerNumPortsRequired(server);
    if (serverPortRequired === 0) {
      servers0Port.push(`"${server}"`);
    } else if (serverPortRequired === 1) {
      servers1Port.push(`"${server}"`);
    } else if (serverPortRequired === 2) {
      servers2Port.push(`"${server}"`);
    } else if (serverPortRequired === 3) {
      servers3Port.push(`"${server}"`);
    } else if (serverPortRequired === 4) {
      servers4Port.push(`"${server}"`);
    } else {
      servers5Port.push(`"${server}"`);
    }
  }

  ns.tprint(`Servers that require 0 port open: ${servers0Port}`);
  ns.tprint(`Servers that require 1 port open: ${servers1Port}`);
  ns.tprint(`Servers that require 2 port open: ${servers2Port}`);
  ns.tprint(`Servers that require 3 port open: ${servers3Port}`);
  ns.tprint(`Servers that require 4 port open: ${servers4Port}`);
  ns.tprint(`Servers that require 5 port open: ${servers5Port}`);

}
/** ns.tprint(`${server}'s Max Money: ${ns.getServerMaxMoney(server)}`);
    ns.tprint(`${server}'s Hack Chance: ${Math.floor(ns.hackAnalyzeChance(server) * 100)}%`);

**/