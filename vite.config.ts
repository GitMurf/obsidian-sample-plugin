import {
  type BuildOptions,
  defineConfig,
  type UserConfig,
  type ESBuildOptions,
  type AliasOptions,
} from 'vite';
import builtins from 'builtin-modules';
import { join } from 'node:path';
import type { TypescriptAliasPaths } from './.config/vite/types';

const viteRunArgsLast = process.argv[process.argv.length - 1] as
  | 'development'
  | 'production'
  | 'test';
const viteRunType =
  ['development', 'production', 'test'].includes(viteRunArgsLast) ? viteRunArgsLast : (
    undefined
  );

const IS_PROD = viteRunType === 'production';
const IS_TEST = viteRunType === 'test';
const IS_DEV = viteRunType === 'development' || !viteRunType;
// IS_BUILD will always be true; Obsidian plugin dev does not need dev server
const IS_BUILD = IS_PROD || IS_TEST || IS_DEV;
const VITE_ROOT = join(__dirname);

const watcherOptions: BuildOptions['watch'] = {
  // How long to wait before triggering a rebuild for any file changes.
  buildDelay: 500,
  // Whether to clear the screen when a rebuild is triggered.
  clearScreen: true,
  include: ['src/**/*'],
  // excluding node_modules is probably unnecessary as it does not match the "include" above
  exclude: ['node_modules/**'],
  // Whether to skip the bundle.write() step when a rebuild is triggered.
  skipWrite: false,
  // Watch options passed to the bundled chokidar instance. See the chokidar documentation for details.
  // chokidar: {
  //   usePolling: true,
  //   interval: 100,
  // },
};

const FULL_MINIFY_OBFUSCATE = IS_PROD;

const esbuildOptions: ESBuildOptions = {
  color: true,
  logLevel: 'verbose',
  logLimit: 990,
  minifyWhitespace: FULL_MINIFY_OBFUSCATE,
  minifyIdentifiers: FULL_MINIFY_OBFUSCATE,
  minifySyntax: FULL_MINIFY_OBFUSCATE,
  keepNames: !FULL_MINIFY_OBFUSCATE,
  // even though this is most likely overridden by rollupOptions.treeShake
  treeShaking: IS_PROD ? true : false,
  target: 'es2018',
};

const finalResult: UserConfig = {
  mode: IS_BUILD ? 'production' : 'development',
  base: './',
  // should be same as process.cwd()
  root: VITE_ROOT,
  resolve: {
    alias: setupAliases(),
  },
  optimizeDeps: {
    exclude: ['obsidian'],
  },
  build: {
    sourcemap: IS_DEV ? 'inline' : false,
    minify: IS_PROD ? 'esbuild' : false,
    emptyOutDir: false,
    // seems you need to call watch here instead of in rollupOptions
    watch: IS_DEV ? watcherOptions : undefined,
    rollupOptions: {
      external: [
        'obsidian',
        'electron',
        '@codemirror/autocomplete',
        '@codemirror/collab',
        '@codemirror/commands',
        '@codemirror/language',
        '@codemirror/lint',
        '@codemirror/search',
        '@codemirror/state',
        '@codemirror/view',
        '@lezer/common',
        '@lezer/highlight',
        '@lezer/lr',
        ...builtins,
        'node:crypto',
      ],
      treeshake: IS_PROD ? 'recommended' : false,
      input: {
        'main-entry': join(VITE_ROOT, 'src', 'main.ts'),
      },
      output: {
        dir: join(VITE_ROOT, '.vite', 'build'),
        chunkFileNames: (chunkInfo) => {
          // console.log(`chunkInfo: ${JSON.stringify(chunkInfo, null, 2)}\n`);
          return chunkInfo.name === 'main' ? 'main.js' : 'unknown-[name]-[hash].js';
        },
        // globals: {
        //   obsidian: 'obsidian',
        // },
      },
    },
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
      name: 'main',
      fileName: (_) => 'main.js',
    },
  },
  esbuild: esbuildOptions,
  // location for static files you just want purely copied to the build output.
  // maybe could use this for styles.css and manifest.json. outputs to outDir
  publicDir: join(VITE_ROOT, 'src/assets'),
  plugins: [],
};

function setupAliases() {
  // these need to sync up with the tsconfig.json (type protected, so we will get errors if not)
  const resolveAliasMapping: TypescriptAliasPaths = {
    '@': 'src',
    '@utils': 'src/utils',
    '@assets': 'src/assets',
    '@tests': '__tests__',
  };
  const resolveAliasConfig: AliasOptions = Object.keys(resolveAliasMapping).map(
    (eachKey) => {
      return {
        find: eachKey,
        replacement: join(
          VITE_ROOT,
          resolveAliasMapping[eachKey as keyof typeof resolveAliasMapping]
        ),
      };
    }
  );
  return resolveAliasConfig;
}

// console.log('VITE CONFIG:', JSON.stringify(finalResult, null, 2));
// https://vitejs.dev/config
export default defineConfig(finalResult);
