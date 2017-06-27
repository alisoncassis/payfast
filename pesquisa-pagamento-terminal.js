var http = require('http');

var configuracoes = {
  hostname: 'localhost',
  port: 3000,
  path: '/pagamentos/pagamento/38',
  method: 'get',
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json'
  }
};

var client = http.request(configuracoes, function(res){
  console.log(res.statusCode);
  res.on('data', function(body){
    console.log('Corpo: ' + body);
  });
});


client.end(
);
