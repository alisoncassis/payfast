module.exports = function(app){

  app.post('/correios/calculo-prazo', function(req, res){

    var dadosEntrega = req.body;

    var correiosSOAPClient = new app.servicos.correiosSOAPCliente();
    correiosSOAPClient.calculaPrazo(dadosEntrega, function(err, resultado){
      if(err){
        res.status(500).send(err);
        return;
      }
      console.log('prazo calculado');
      res.json(resultado);
    });

  });
}
