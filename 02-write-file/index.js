const fs = require('fs');
const path = require('path');
const readline = require('readline');

let filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath);

const { stdin, stdout } = process;
stdout.write('Hello! Please, write the text\n');

stdin.on('data', (chunk) => {  
  //console.log(chunk)
  let stop = chunk.toString().trim();
  //console.log(stop.length)
  if (stop === 'exit') {
    stdout.write(`Good luck!`);
    process.exit();
  } else {
    output.write(chunk);
  }
});
stdin.on('error', error => console.log('Error', error.message));

process.on('SIGINT', () => {
  stdout.write(`Good luck!`);
  process.exit();
});
