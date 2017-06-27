var http = require('http');
var fs = require('fs');

var configuracoes = {
  hostname: 'localhost',
  port: 3000,
  path: '/upload/imagem',
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/octet-stream',
    'Filename': 'imagem-do-cliente2.png'
  }
};

var client = http.request(configuracoes, function(res){
  // fs.createReadStream('logo.png')
  // .on('finish', function(err, result){
  //   return result;
  // });
  console.log(res.statusCode);
  res.on('data', function(body){
    console.log('dados da entrega: ' + body);
  });
});

var entrega = fs.createReadStream('logo.png');

client.end(entrega, 'binary');
