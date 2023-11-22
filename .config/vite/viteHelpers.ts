import type { AliasOptions } from 'vite';
import { join } from 'node:path';
import type { TypescriptAliasPaths } from './types';
import { VITE_ROOT } from './viteConstants';

export function setupAliases() {
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
