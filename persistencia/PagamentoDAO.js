function PagamentoDAO(connection){
    this._connection = connection;
}

PagamentoDAO.prototype.lista = function(callback){
  this._connection.query('select * from pagamentos', callback);
}

PagamentoDAO.prototype.atualiza = function(pagamento, callback){
  this._connection.query('update pagamentos set status = ? where id = ?', [pagamento.status, pagamento.id], callback);
}

PagamentoDAO.prototype.salva = function(pagamento, callback){
  this._connection.query('insert into pagamentos set ?', pagamento, callback);
}

PagamentoDAO.prototype.deleta = function(pagamento, callback){
  this._connection.query('delete from pagamentos where id = ?', pagamento.id, callback);
}
PagamentoDAO.prototype.buscaPorId = function(id, callback){
  this._connection.query('select * from pagamentos where id = ?', [id], callback);
}

module.exports = function(){
    return PagamentoDAO;
}
