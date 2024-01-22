const fs = require('fs').promises;
const path = require('path');

const sourceDirectory = path.resolve(__dirname, 'files');
const destDirectory = path.resolve(__dirname, 'files-copy');

const copyDirectory = async (sourceDirectory, destDirectory) => {
  try {
    if (!(await directoryExists(destDirectory))) {
      await fs.mkdir(destDirectory, { recursive: true });
    }

    const sourceFileNames = await fs.readdir(sourceDirectory);
    const destFileNames = await fs.readdir(destDirectory);

    const filesToRemove = destFileNames.filter(
      (file) => !sourceFileNames.includes(file),
    );

    await Promise.all(
      filesToRemove.map((file) => fs.unlink(path.join(destDirectory, file))),
    );

    await Promise.all(
      sourceFileNames.map(async (fileName) => {
        const sourcePath = path.join(sourceDirectory, fileName);
        const destPath = path.join(destDirectory, fileName);
        await fs.copyFile(sourcePath, destPath);
      }),
    );

    return sourceFileNames.map((fileName) =>
      path.join(destDirectory, fileName),
    );
  } catch (err) {
    console.error('Err:', err.message);
    throw err;
  }
};

const directoryExists = async (directoryPath) => {
  try {
    await fs.access(directoryPath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

copyDirectory(sourceDirectory, destDirectory).catch((err) => {
  console.error('Error copying directory:', err);
});
