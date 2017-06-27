var cluster = require('cluster');
var os = require('os');

var cpus = os.cpus();

console.log('executando nova thread');

if(cluster.isMaster){
  console.log('agora vai como master');

  cpus.forEach(function(){
    cluster.fork();
  });

  cluster.on('listening', function(worker){
    console.log('novo cluster conectado ' + worker.process.pid);
  });

  cluster.on('exit', worker => {
    console.log('cluster %d desconectado', worker.process.pid);
    cluster.fork();
  });

}else{
  console.log('thread slave');
  require('./index.js');
}
