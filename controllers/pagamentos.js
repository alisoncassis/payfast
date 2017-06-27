var logger = require('../servicos/logger.js');
module.exports = function(app){
  app.get('/pagamentos', function(req, res){
    console.log('requisicao recebida em /teste');
    res.send('ok');
  });

  app.get('/pagamentos/pagamento/:id', function(req, res){
    var id = req.params.id;
    console.log('consultando pagamento:' + id);
    logger.info('consultando pagamento:' + id);

    var memCachedClient = app.servicos.memCachedClient();
    memCachedClient.get('pagamento-' + id, function(erro, retorno){
      if(erro || !retorno){
        console.log('MISS - chave nao encontrada');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.buscaPorId(id, function(erro, resultado){
          if(erro){
            console.log('erro ao consultar no banco:' + erro);
            res.status(500).send(erro);
            return;
          }
          console.log('pagamento encontrado:' + JSON.stringify(resultado));
          res.json(resultado);
          return;
        });
      } else {
        //HIT
        console.log('HIT - valor:' + JSON.stringify(retorno));
        res.json(retorno);
        return;
      }
    });

  });

  app.put('/pagamentos/pagamento/:id', function(req, res){
    var id = req.params.id;
    var pagamento = {};

    pagamento.id = id;
    pagamento.status = 'CONFIRMADO';

    var connection = app.persistencia.connectionFactory();
    var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

    pagamentoDAO.atualiza(pagamento, function(erro, resultado){
      if(erro){
        res.status(500).send(erro);
        return;
      } else {
        console.log('pagamento atualizadp');
        res.status(200).send('ok');
      }
    });
  });

  app.delete('/pagamentos/pagamento/:id', function(req, res){
    var id = req.params.id;
    var pagamento = {};

    pagamento.id = id;
    pagamento.status = 'CANCELADO';

    var connection = app.persistencia.connectionFactory();
    var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

    pagamentoDAO.atualiza(pagamento, function(erro, resultado){
      if(erro){
        res.status(500).send(erro);
        return;
      } else {
        console.log('pagamento cancelado');
        res.status(202).send('ok');
      }
    });
  });

  app.post('/pagamentos/pagamento', function(req, res){

    req.assert('pagamento.forma_de_pagamento',
     'forma de pagamento é obrigatorio').notEmpty();
    req.assert('pagamento.valor',
     'valor deve ser decimal e obrigatorio').notEmpty().isFloat();

    var erros =req.validationErrors();
    if(erros){
      console.log('erros de validacao nos dados do pagamento');
      res.status(400).send(erros);
      return;
    }
    var pagamento = req.body['pagamento'];
    console.log('processando req de pagamento');

    if (pagamento.forma_de_pagamento != 'payfast'){
      console.log('contatando parceiro devido a forma de pagamento');
      var cartao = req.body['cartao'];
      console.log(cartao);

      var clienteCartoes = new app.servicos.clienteCartoes();
      clienteCartoes.autoriza(cartao, function(exception, request, response, retorno){
          if(exception){
            console.log('erros na validacao do cartao');
            console.log(exception);
            res.status(400).send(exception);
            return;
          }
          console.log(retorno);
          pagamento.status = 'CRIADO';
          pagamento.data = new Date;

          var connection = app.persistencia.connectionFactory();
          var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

          pagamentoDAO.salva(pagamento, function(erro, resultado){
            if (erro){
              res.status(500).send(erro);
            } else {

              var idPagamento = resultado.insertId;
              pagamento.id = idPagamento;

              var memCachedClient = new app.servicos.memCachedClient();

              memCachedClient.set('pagamento-' + idPagamento, resultado, 600000,
               function(erro){
                console.log('nova chave add ao cache: pagamento-' + idPagamento);
              });

              console.log('pagamento criado com apoio de parceiro');
            }
            res.location('/pagamentos/pagamento/' + pagamento.id);

            var response = {
              dados_do_pagamento: pagamento,
              cartao: retorno,
              links: [
                {
                  href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
                  rel: 'confirmar',
                  method: 'PUT'
                },
                {
                  href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
                  rel: 'cancelar',
                  method: 'DELETE'
                }
              ]
            };
            res.status(201).json(response);

          });
      });
    } else {
      var pagamento = req.body['pagamento'];

      pagamento.status = 'CRIADO';
      pagamento.data = new Date;

      var connection = app.persistencia.connectionFactory();
      var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

      pagamentoDAO.salva(pagamento, function(erro, resultado){
        if (erro){
          res.status(500).send(erro);
        } else {

          var idPagamento = resultado.insertId;
          pagamento.id = idPagamento;

          var memCachedClient = new app.servicos.memCachedClient();

          memCachedClient.set('pagamento-' + idPagamento, resultado, 600000,
           function(erro){
            console.log('nova chave add ao cache: pagamento-' + idPagamento);
          });

          console.log('pagamento criado pela payfast');
        }
        res.location('/pagamentos/pagamento/' + pagamento.id);

        var response = {
          dados_do_pagamento: pagamento,
          links: [
            {
              href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
              rel: 'confirmar',
              method: 'PUT'
            },
            {
              href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
              rel: 'cancelar',
              method: 'DELETE'
            }
          ]
        };

        res.status(201).json(response);
      });
    }
  });
}
//     pagamento.status = 'CRIADO';
//     pagamento.data = new Date;
//
//     var connection = app.persistencia.connectionFactory();
//     var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);
//
//     pagamentoDAO.salva(pagamento, function(erro, resultado){
//       if (erro){
//         res.status(500).send(erro);
//       } else {
//         console.log('pagamento criado');
//
//         if (pagamento.forma_de_pagamento != 'payfast'){
//           var cartao = req.body['cartao'];
//           console.log(cartao);
//
//           var clienteCartoes = new app.servicos.clienteCartoes();
//           clienteCartoes.autoriza(cartao,
//             function(exception, request, response, retorno){
//               if(exception){
//                 console.log(exception);
//                 res.status(400).send(exception);
//                 return;
//               }
//                 console.log(retorno);
//                 res.location('/pagamentos/pagamento/' + pagamento.id);
//                 pagamento.id = resultado.insertId;
//
//                 var response = {
//                   dados_do_pagamento: pagamento,
//                   cartao: retorno,
//                   links: [
//                     {
//                       href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
//                       rel: 'confirmar',
//                       method: 'PUT'
//                     },
//                     {
//                       href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
//                       rel: 'cancelar',
//                       method: 'DELETE'
//                     }
//                   ]
//                 }
//
//                 res.status(201).json(response);
//
//           });
//
//         } else {
//           res.location('/pagamentos/pagamento/' + pagamento.id);
//           pagamento.id = resultado.insertId;
//
//           var response = {
//             dados_do_pagamento: pagamento,
//             links: [
//               {
//                 href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
//                 rel: 'confirmar',
//                 method: 'PUT'
//               },
//               {
//                 href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
//                 rel: 'cancelar',
//                 method: 'DELETE'
//               }
//             ]
//           }
//
//           res.status(201).json(response);
//
//         }
//       }
//     });
//   });
// }
