const cluster = require('cluster');

if (cluster.isMaster) {
  console.log('this is a master');
  cluster.fork()
  cluster.fork()
} else {
  console.log('this is a worker');
}
