const fs = require('fs');
const path = require('path');
let filePath = path.join(__dirname, 'styles');
let bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

const bundle = fs.createWriteStream(bundleFilePath, 'utf-8')

console.log(filePath);

fs.readdir(filePath, {withFileTypes: true}, (err, files) => {
    if(err) throw err; // do not read the contents of the folder
    //console.log(files);
    for (let file of files) {
      const extension = path.extname(file.name);
      //console.log(extension)
        if (!file.isDirectory() & (extension == '.css') ) {
          //console.log(file.name);
          let readFilePath = path.join(__dirname, 'styles', file.name);
          let stream = fs.createReadStream(readFilePath, 'utf-8');
            stream.on('data', data => {
              bundle.write(data.toString() + '\n')
            })
        }
    };
 });

