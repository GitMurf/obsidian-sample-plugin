import type { Plugin } from 'vite';

export default function getViteConfigInfo(): Plugin {
  return {
    name: 'get-config-info',
    config(configObj, env) {
      console.log('[get-config-info] => Vite Config:', configObj);
      console.log('[get-config-info] => Vite env:', env);
    },
    configResolved(resolvedConfig) {
      console.log(
        '[get-config-info] => configResolved:',
        JSON.stringify(resolvedConfig, null, 2)
      );
    },
  };
}
