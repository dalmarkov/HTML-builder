const fs = require('fs').promises;
const path = require('path');

async function createHtml() {
  try {
    const pathFileTemplate = path.join(__dirname, 'template.html');
    const templateHtml = await fs.readFile(pathFileTemplate, 'utf-8');

    const regex = /\{\{([^}]+)\}\}/g;
    const matches = templateHtml.match(regex);

    let updatedHtml = templateHtml;

    if (matches) {
      for (const match of matches) {
        const fileName = match.slice(2, -2) + '.html';
        const pathFile = path.join(__dirname, 'components', fileName);

        const part = await fs.readFile(pathFile, 'utf-8');
        updatedHtml = updatedHtml.replace(match, part.trim());
      }
    }

    await fs.writeFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      updatedHtml,
    );
  } catch (err) {
    console.error('Error creating HTML:', err.message);
  }
}

async function completeCss() {
  try {
    const folderPath = path.join(__dirname, 'styles');
    const newFolderPath = path.join(__dirname, 'project-dist');

    const output = await fs.open(path.join(newFolderPath, 'style.css'), 'w');

    const filenames = await fs.readdir(folderPath, { withFileTypes: true });

    for (const filename of filenames) {
      const type = path.extname(filename.name).slice(1);
      if (type === 'css' && !filename.isDirectory()) {
        const arr = [];
        const input = await fs.readFile(
          path.join(folderPath, filename.name),
          'utf-8',
        );
        arr.push(input);
        await output.writeFile(arr.join('') + '\n');
      }
    }

    await output.close();
  } catch (err) {
    console.error('Error compiling styles:', err.message);
  }
}

async function copyAssets() {
  try {
    const sourcePath = path.join(__dirname, 'assets');
    const destinationPath = path.join(__dirname, 'project-dist', 'assets');

    await fs.mkdir(destinationPath, { recursive: true });

    const folderNames = await fs.readdir(sourcePath, { withFileTypes: true });

    for (const folderName of folderNames) {
      if (folderName.isDirectory()) {
        const folderInternalPath = path.join(sourcePath, folderName.name);
        const newFolderInternalPath = path.join(
          destinationPath,
          folderName.name,
        );

        await fs.mkdir(newFolderInternalPath, { recursive: true });

        const fileNames = await fs.readdir(folderInternalPath, {
          withFileTypes: true,
        });

        for (const fileName of fileNames) {
          const filePath = path.join(folderInternalPath, fileName.name);
          const newFilePath = path.join(newFolderInternalPath, fileName.name);

          await fs.copyFile(filePath, newFilePath);
        }
      }
    }
  } catch (err) {
    console.error('Error copying assets:', err.message);
  }
}

async function buildPage() {
  try {
    await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    await createHtml();
    await completeCss();
    await copyAssets();
  } catch (err) {
    console.error('Build failed:', err.message);
  }
}

buildPage();
