import { join } from 'node:path';
import { defineConfig, type UserConfig } from 'vite';
import type { VitestTestGlobsEnvTuples } from './.config/vite/types';
import { configDefaults } from 'vitest/dist/config';
// import type { UserConfig as VitestConfig } from 'vitest';

const VITE_ROOT = join(__dirname);
const VITE_PATHS = {
  vitest: {
    testRoot: join(VITE_ROOT, '__tests__'),
    outputDirectory: join(VITE_ROOT, '__tests__', '__output__'),
  },
};

const vitestDefaults = configDefaults;
const vitestConfigObject: UserConfig = {
  test: {
    dir: VITE_PATHS.vitest.testRoot,

    // runs once per entire test cycle before all tests
    // IGNORE FOR NOW... SEE COMMENTS IN setupGlobalOnce.ts
    globalSetup: [
      // join(VITE_PATHS.vitest.testRoot, '__setupFiles__', 'setupGlobalOnce.ts'),
    ],

    setupFiles: [join(VITE_PATHS.vitest.testRoot, '__setupFiles__', 'setupEachTest.ts')],
    maxConcurrency: 5, // default: 5
    sequence: {
      concurrent: false, // default: false
      shuffle: false, // default: false
      setupFiles: 'parallel', // default: 'parallel'
    },
    watch: false, // use "pnpm run test:watch" to go into watch mode
    // globals: true, // not sure what to do with this one yet
    // environment: source === 'renderer' ? 'jsdom' : 'node', // 'node' (default), 'edge-runtime', 'happy-dom', 'jsdom'
    environment: 'node', // starting everything as node for now (matchGlobs will specialize further)
    // add e.g., "// @vitest-environment jsdom" at top of any test to override individual files
    environmentMatchGlobs: [
      ['__tests__/main/**/*.test.?(c|m)[jt]s?(x)', 'node'],
      ['__tests__/utilityTypes/**/*.test.?(c|m)[jt]s?(x)', 'node'],
    ] satisfies VitestTestGlobsEnvTuples[],
    environmentOptions: {
      // jsdom: {
      //   url: `http://localhost:${VITE_PATHS.port}/`,
      // },
    },

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json'],
      all: false,
      clean: true,
      cleanOnRerun: true,
      // exclude from test coverage % covered
      exclude: [
        ...(vitestDefaults.coverage.exclude ?? []),
        // add any user excluded patterns
      ],
      reportsDirectory: join(VITE_PATHS.vitest.outputDirectory, 'coverage', 'all'),
    },
    reporters: [
      'verbose',
      // 'basic',
      // 'dot',
      // 'default',
      // 'hanging-process',
      // 'html',
      // 'json',
      // 'tap-flat',
    ],
    outputFile: {
      'default': join(VITE_PATHS.vitest.outputDirectory, 'default', 'all'),
      'basic': join(VITE_PATHS.vitest.outputDirectory, 'basic', 'all'),
      'verbose': join(VITE_PATHS.vitest.outputDirectory, 'verbose', 'all'),
      'tap-flat': join(VITE_PATHS.vitest.outputDirectory, 'tap-flat', 'all'),
      'json': join(VITE_PATHS.vitest.outputDirectory, 'json', 'all'),
      'dot': join(VITE_PATHS.vitest.outputDirectory, 'dot', 'all'),
    },
    include: ['src/**/*.test.?(c|m)[jt]s?(x)', 'utilityTypes/**/*.test.?(c|m)[jt]s?(x)'],
    env: {
      // NODE_ENV: 'test', // this is already set by vite "mode"
      foo: 'bar',
      baz: 'qux',
    },

    // UI not working right now when set in config... just use the "vitest --ui" flag instead with "pnpm run test:main:ui" for example
    // ui: true,

    exclude: [...vitestDefaults.exclude],
  },
};

// console.log('vitest FINAL:', JSON.stringify(finalResult, null, 2));
export default defineConfig(vitestConfigObject);
