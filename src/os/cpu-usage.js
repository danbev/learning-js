const os = require('os');
const cpus = os.cpus();
console.log(`Nr of CPUs: ${cpus.length}`);
console.log(cpus);
