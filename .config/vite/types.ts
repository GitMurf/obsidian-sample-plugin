import type { UserConfig } from 'vite';
import type {
  UtilityObjectGetNestedUnion,
  UtilityObjectWritable,
  UtilityTupleChangeItemAtIndex,
} from '../../src/types/utilityTypes/utilityTypes';
import type { VitestEnvironment } from 'vitest';
import tsConfig from '../../tsconfig.json';
const tsAlias = tsConfig.compilerOptions.paths;

// these need to sync up with the tsconfig.json
export type TypescriptAliasPaths = {
  [P in keyof typeof tsAlias as P extends `${infer TInfer}/*` ? TInfer : P]: P extends (
    '@/*'
  ) ?
    'src'
  : P extends '@tests/*' ? '__tests__'
  : P extends `@${infer TRest}/*` ? `src${string}/${TRest}`
  : never;
};

export type ViteUserConfigFilter<
  TInclude extends keyof UserConfig = never,
  TExclude extends Exclude<keyof UserConfig, TInclude> = never,
> = {
  [P in keyof UserConfig as Extract<TInclude, TInclude> extends never ?
    P extends TExclude ?
      never
    : P
  : P extends TInclude ?
    P extends TExclude ?
      never
    : P
  : never]: UserConfig[P];
};

// vitest

type VitestEnvironmentIncludes = {
  glob: string | undefined;
  environment: VitestEnvironment | undefined;
}[];
/**
 * Mainly necessary for Electron apps (probably overkill for Obsidian plugins)
 */
const vitestGlobs = {
  backend: {
    main: {
      include: [
        {
          glob: 'main/**/*.test.?(c|m)[jt]s?(x)',
          environment: 'node',
        } as const,
      ] satisfies VitestEnvironmentIncludes,
      exclude: [],
    },
    utility: {
      include: [
        {
          glob: 'utilityTypes/**/*.test.?(c|m)[jt]s?(x)',
          environment: 'node',
        } as const,
      ] satisfies VitestEnvironmentIncludes,
      exclude: [],
    },
  },
  other: {
    other: {
      include: [
        {
          glob: undefined,
          environment: undefined,
        } as const,
      ] satisfies VitestEnvironmentIncludes,
      exclude: [],
    },
  },
} as const;

export type VitestTestGlobs = typeof vitestGlobs;

export type VitestTestGlobsIncludes = UtilityObjectGetNestedUnion<
  VitestTestGlobs,
  'include',
  'glob'
>;

type VitestTestGlobsPairs = Exclude<
  UtilityObjectWritable<
    {
      [P in keyof VitestTestGlobs]: {
        [K in keyof VitestTestGlobs[P]]: VitestTestGlobs[P][K];
      }[keyof VitestTestGlobs[P]];
    }[keyof VitestTestGlobs]['include'][number]
  >,
  { glob: undefined }
>;
type VitestTestGlobsTuples = {
  [P in VitestTestGlobsPairs['glob']]: [
    Extract<VitestTestGlobsPairs, { glob: P }>['glob'],
    Extract<VitestTestGlobsPairs, { glob: P }>['environment'],
  ];
}[VitestTestGlobsPairs['glob']];

export type VitestTestGlobsEnvTuples = UtilityTupleChangeItemAtIndex<
  VitestTestGlobsTuples,
  '__tests__/',
  'prepend',
  '0'
>;

export type UserConfigTest = UserConfig['test'];
export type ViteConfigName = 'main' | 'base' | 'vitest';

type ViteMergeObjectTypes =
  | Extract<NonNullable<UserConfig>, object>
  | Extract<NonNullable<UserConfig['test']>, object>
  | Extract<NonNullable<UserConfig['esbuild']>, object>
  | Extract<NonNullable<UserConfig['build']>, object>
  | Extract<NonNullable<UserConfig['resolve']>, object>
  | Extract<NonNullable<UserConfig['plugins']>, object>
  | Extract<NonNullable<UserConfig['server']>, object>;

export type ViteConfigMergeTypes = NonNullable<ViteMergeObjectTypes>;

// these are based on the default / bare minimum that electron-forge uses/requires out of the box for the vite-plugin
// const viteForgeFinalCoreConfig: {
//   main: UserConfig;
//   renderer: UserConfig;
//   vitest: UserConfig;
// } = {
//   // HERE IS THE BASE STARTING CONFIG for "main" FROM THE FORGE-VITE PLUGIN FROM forge's "ViteConfig.ts"
//   main: {
//     // Ensure that each build config loads the .env file correctly.
//     mode: undefined,
//     build: {
//       lib: {
//         entry: 'this/path',
//         formats: ['cjs'],
//         fileName: () => '[name].js',
//       },
//       emptyOutDir: false,
//       // outDir: join('root', '.vite', 'build'),
//       watch: {},
//     },
//     clearScreen: false,
//     define: undefined,
//     plugins: undefined,
//   },
//   // HERE IS THE BASE STARTING CONFIG for renderer FROM THE FORGE-VITE PLUGIN FROM forge's "ViteConfig.ts"
//   renderer: {
//     // Ensure that each build config loads the .env file correctly.
//     mode: undefined,
//     base: './',
//     build: {
//       outDir: join('this.baseDir', 'renderer', 'name'),
//     },
//     clearScreen: false,
//   },
//   vitest: {}, // TBD
// };

export type VitePluginOptions =
  | 'get-config-info'
  | 'change-config-info'
  | 'solid'
  | 'eslint'
  | 'solid-dev-tools'
  | 'hello-world'
  | 'log-plugin-hooks'
  | 'build-troubleshoot';

type VitePluginOptionsExtract<T extends VitePluginOptions> = Extract<
  VitePluginOptions,
  T
>;

// for renderer vite plugins and to be used for vitest unit testing as well
export type VitePluginOptionsRenderer = VitePluginOptionsExtract<'solid'>;
type VitePluginOptionsOverride = VitePluginOptionsExtract<'change-config-info'>;
export type VitePluginOptionsVitest =
  | VitePluginOptionsRenderer
  | VitePluginOptionsOverride;
