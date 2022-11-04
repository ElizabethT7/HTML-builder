
const fs = require('fs');
const path = require('path');
let filePath = path.join(__dirname, 'secret-folder');
console.log(filePath);
const { stdout } = process;

fs.readdir(filePath, {withFileTypes: true}, (err, files) => {
  files.forEach(file => {
    if (!file.isDirectory()) {
      const name = path.parse(file.name).name;
      const extension = path.extname(file.name).toString().slice(1);
      let size;   
      //console.log(file.name);
      //console.log(path.extname(file.name))
      let innerFilePath = path.join(__dirname, 'secret-folder', file.name)
      fs.stat(innerFilePath, function(err, stats) {
        if (err) { throw err; }
        let size;
        if (stats.isFile()) { 
          size = stats.size;
        } 
        stdout.write(`${name} - ${extension} - ${size}b\n` )
      });
    }
  });
});;






