var mysql = require('mysql');

var connectMYSQL = function (){
  if(!process.env.NODE_ENV){
    return mysql.createConnection({
      host: 'localhost',
      user: 'admin',
      password: 'senha',
      database: 'payfast'
    });
  }
  if(process.env.NODE_ENV == 'test'){
    return mysql.createConnection({
      host: 'localhost',
      user: 'admin',
      password: 'senha',
      database: 'payfast_test'
    });
  }
};

module.exports = function(){
  return connectMYSQL;
}
