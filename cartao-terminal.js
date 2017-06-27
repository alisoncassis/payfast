var http = require('http');

var configuracoes = {
  hostname: 'localhost',
  port: 3001,
  path: '/cartoes/autoriza',
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json'
  }
};

var client = http.request(configuracoes, function(res){
  console.log(res.statusCode);
  res.on('data', function(body){
    console.log('location = /pagamentos/pagamento/' + body.id);
    console.log('Corpo: ' + body);
  });
});

var produto = {
  numero: 1234567890123456,
  bandeira: 'Master Cred',
  ano_de_expiracao: 2018,
  mes_de_expiracao: 12,
  cvv: 234
};

client.end(
  JSON.stringify(produto)
);
