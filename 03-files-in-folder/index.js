const fs = require('fs');
const path = require('path');

const requiredPath = path.resolve(__dirname, 'secret-folder');

function getFileSize(filePath, callback) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else {
      callback(null, stats.size);
    }
  });
}

fs.readdir(requiredPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach((file) => {
    if (!file.isDirectory()) {
      const filePath = path.resolve(requiredPath, file.name);
      const { name, ext } = path.parse(filePath);
      const extPath = ext.substring(1);
      getFileSize(filePath, (err, fileSize) => {
        if (err) {
          console.error(`Error processing file ${name}: ${err.message}`);
        } else {
          process.stdout.write(`${name} - ${extPath} - ${fileSize} bytes\n`);
        }
      });
    }
  });
});
