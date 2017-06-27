var fs = require('fs');

fs.readFile('logo.png', function(erro, buffer){
  console.log('arquivo lido');

  fs.writeFile('logo2.png', buffer, function(err){
    console.log('arquivo escrito');
  });
});
