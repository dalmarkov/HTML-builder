const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.resolve(__dirname, 'styles');
const outputFolderPath = path.resolve(__dirname, 'project-dist');
const outputFile = path.join(outputFolderPath, 'bundle.css');

const styleFiles = fs.readdirSync(stylesFolderPath);

const stylesArray = [];

styleFiles.forEach((file) => {
  const filePath = path.join(stylesFolderPath, file);

  if (fs.statSync(filePath).isFile() && file.endsWith('.css')) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    stylesArray.push(fileContent);
  }
});

fs.writeFileSync(outputFile, stylesArray.join('\n'), 'utf-8');

console.log('CSS bundle created.');
