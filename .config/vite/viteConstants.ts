import { join } from 'node:path';

export const VITE_ROOT = join(__dirname);
export const VITE_PATHS = {
  vitest: {
    testRoot: join(VITE_ROOT, '__tests__'),
    outputDirectory: join(VITE_ROOT, '__tests__', '__output__'),
  },
};

const viteRunArgsLast = process.argv[process.argv.length - 1] as
  | 'development'
  | 'production'
  | 'test';
export const VITE_RUN_TYPE =
  ['development', 'production', 'test'].includes(viteRunArgsLast) ? viteRunArgsLast : (
    undefined
  );

export const IS_PROD = VITE_RUN_TYPE === 'production';
const IS_TEST = VITE_RUN_TYPE === 'test';
export const IS_DEV = VITE_RUN_TYPE === 'development' || !VITE_RUN_TYPE;
// IS_BUILD will always be true; Obsidian plugin dev does not need dev server
export const IS_BUILD = IS_PROD || IS_TEST || IS_DEV;

export const FULL_MINIFY_OBFUSCATE = IS_PROD;
