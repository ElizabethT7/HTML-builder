const fs = require('fs');
const path = require('path');
let filePath = path.join(__dirname, 'project-dist');

//create folder
async function createFolder() {
  fs.mkdir(filePath, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
         
  await  fs.readdir(filePath, {withFileTypes: true}, (err, files) => {
    if (err) throw err; 
      for (const file of files) {
        if (!file.isDirectory()) {
          fs.unlink(path.join(filePath, file.name), (err) => {
            if (err) throw err; 
            //console.log('Delete file');
          });
        }
      }
  });
}
createFolder();

//bundle html 
fs.readFile(path.join(__dirname, 'template.html'), "utf8", 
  function(error, data){
    if(error) throw error;  
    //console.log(data);  // выводим считанные данные
    function readComponents() {
      fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, (err, files) => {
        files.forEach(file => {
          const extension = path.extname(file.name);
          if (!file.isDirectory()& (extension == '.html')) {
            const templateTag = path.parse(file.name).name;
            //создать поток чтения file.name и записи
            let readFilePath = path.join(__dirname, 'components', file.name);
            let stream = fs.createReadStream(readFilePath, 'utf-8');
            let index = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');

            stream.on('data', dataComponent => {
              //console.log(dataComponent)
              let componentData = dataComponent.toString() //+ '\n';
              //console.log(componentData);
              data = data.replace(`{{${templateTag}}}`, `${componentData}`);
              index.write(data);
            });    
          };
        });
      });
    };            
    readComponents();                
});

//bundle css style
fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  if(err) throw err; // do not read the contents of the folder
    const style = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
    for (let file of files) {
      const extension = path.extname(file.name);
      let readFilePath = path.join(__dirname, 'styles', file.name);
        if (!file.isDirectory() & (extension == '.css') ) {
          let stream = fs.createReadStream(readFilePath, 'utf-8');
            stream.on('data', data => {
              style.write(data.toString() + '\n')
            })
        }
    };
 });

//copy assets
async function copyDir() {
  let folderAssetsPath = path.join(__dirname, 'project-dist', 'assets');

  fs.mkdir(folderAssetsPath, { recursive: true }, (err) => {
    let assetsReadPath = path.join(__dirname, 'assets')
    fs.readdir(assetsReadPath, {withFileTypes: true}, (err, files) => {
     if(err) throw err; // do not read the contents of the folder
       files.forEach(file => {
         if (!file.isDirectory()){
           fs.copyFile(`${assetsReadPath}/${file.name}`, `${folderAssetsPath}/${file.name}`, err => {
               if(err) throw err; // failed to copy file
           });
         } else {
           fs.mkdir(path.join(__dirname, 'project-dist', 'assets', file.name), { recursive: true }, (err) => {
             let assetsFilePath = path.join(__dirname, 'assets', file.name)
             fs.readdir(assetsFilePath, (err, items) => {
               if(err) throw err; // do not read
               items.forEach(item => {
                 fs.copyFile(path.join(__dirname, 'assets', file.name, item), path.join(__dirname, 'project-dist', 'assets', file.name, item), err => {
                   if(err) throw err; // failed to copy file
                   //console.log('File  successfully copied');
                 })
               });
             });
             if (err) {
               console.error(err);
               return;
             }
           });
         }    
       });
    });
    if (err) {
      console.error(err);
      return;
    }
  });
};
copyDir();



