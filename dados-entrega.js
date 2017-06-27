var http = require('http');

var configuracoes = {
  hostname: 'localhost',
  port: 3000,
  path: '/correios/calculo-prazo',
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json'
  }
};

var client = http.request(configuracoes, function(res){
  console.log(res.statusCode);
  res.on('data', function(body){
    console.log('dados da entrega: ' + body);
  });
});

var entrega = {
  "nCdServico": "40010",
  "sCepOrigem":"03267070",
  "sCepDestino": "65000600"
};

client.end(
  JSON.stringify(entrega)
);
