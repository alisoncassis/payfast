var soap = require('soap');

function CorreiosSOAPCliente(){
  this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?WSDL';
}

CorreiosSOAPCliente.prototype.calculaPrazo = function(args, callback){
  soap.createClient(this._url, function(erro, cliente){
    console.log('cliente soap criado');

    cliente.CalcPrazo(args, callback);
  });
}

module.exports = function(){
  return CorreiosSOAPCliente;
}
