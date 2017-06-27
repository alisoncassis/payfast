var http = require('http');

var configuracoes = {
  hostname: 'localhost',
  port: 3000,
  path: '/pagamentos/pagamento/',
  method: 'post',
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

var pagamento = {
  pagamento: {
    valor: '150',
    moeda: 'BRL',
    descricao: 'teste',
    forma_de_pagamento: 'master'
  },
  cartao: {
    numero: 1234567890123456,
    bandeira: 'Master Cred',
    ano_de_expiracao: 2018,
    mes_de_expiracao: 12,
    cvv: 234
    }
  };

client.end(
  JSON.stringify(pagamento)
);
