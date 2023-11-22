import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import localConfigJson from '../../local/localConfig.json' assert { type: 'json' };

/**
 * @remarks This script copies the necessary files to your Obsidian vault plugin folder.
 *
 * The reason for these instructions is so you have a template to use but do NOT commit your actual local path.
 * The repo_root/local folder is ignored in the .gitignore file so you are safe to store localConfig.json there.
 *
 * 1. copy localConfig.json.TEMPLATE to /local/localConfig.json
 * 2. fill in the absolute path to your Obsidian vault
 * 3. make sure to remove the .TEMPLATE extension
 */
const OBSIDIAN_VAULT_PLUGIN_PATH = localConfigJson.obsidianPluginPath;

export function copyPluginFilesToObsidian() {
  // copy manifest.json to obsidian plugin
  copyFileToObsidian('manifest.json');
  copyFileToObsidian('src/assets/styles.css');
  copyFileToObsidian('.vite/build/main.js');
  copyFileToObsidian('.github/scripts/.hotreload');
}

function copyFileToObsidian(filePath) {
  const fileName = filePath.split('/').pop();
  copyFileSync(filePath, join(OBSIDIAN_VAULT_PLUGIN_PATH, fileName));
}
