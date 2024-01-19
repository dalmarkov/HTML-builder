const path = require('path');
const fs = require('fs');

const myPath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(myPath, 'utf-8');

readableStream.on('data', (chunk) => console.log(chunk));

readableStream.on('end', () => {
  console.log('read end.');
});

readableStream.on('error', (err) => {
  console.error(`err read: ${err.message}`);
});
