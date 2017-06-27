var fs = require('fs');

fs.createReadStream('logo.png')
  .pipe(fs.createWriteStream('logo-com-stream.png'))
  .on('finish', function(){
    console.log('arquivo escrito com stream');
  });
