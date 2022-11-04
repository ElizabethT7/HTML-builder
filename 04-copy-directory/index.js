const fs = require('fs');
const path = require('path');
let filePath = path.join(__dirname, 'files');

const folder = '04-copy-directory/files-copy';
let folderPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  fs.mkdir(folder, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
         
  await  fs.readdir(folderPath, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(folderPath, file), (err) => {
        if (err) throw err;
        console.log (file)
        console.log('Delete file');
      });
    }
  });
  
  fs.readdir(filePath, (err, files) => {
    if(err) throw err; // do not read the contents of the folder
    files.forEach(file => {
        fs.copyFile(`${filePath}/${file}`, `${folderPath}/${file}`, err => {
            if(err) throw err; // failed to copy file
            console.log('File  successfully copied');
         });
    });

 });
};

copyDir();



