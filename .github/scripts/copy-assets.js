import { copyFileSync, existsSync, mkdirSync } from 'node:fs';

// copy manifest.json to .vite/build
copyFileToBuild('manifest.json');
// copy styles.css to .vite/build
copyFileToBuild('src/assets/styles.css');

function copyFileToBuild(filePath) {
  const fileName = filePath.split('/').pop();
  createDestinationIfNotExists('.vite');
  createDestinationIfNotExists('.vite/build');
  copyFileSync(filePath, `.vite/build/${fileName}`);
}

function createDestinationIfNotExists(destination) {
  if (!existsSync(destination)) {
    mkdirSync(destination);
  }
}
