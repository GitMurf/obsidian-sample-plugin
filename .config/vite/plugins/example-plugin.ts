import type { Plugin } from 'vite';

interface MyPluginOptions {
  foo: string;
  bar: number;
  baz: Date;
}

export const logBuildSettingsPlugin = (options: MyPluginOptions): Plugin => {
  return {
    name: 'log-build-settings',
    buildStart(configOptions) {
      console.log('options:' + configOptions);
      console.log('watcher:' + this.getWatchFiles);
      console.log(options.bar);
    },
    config(config, env) {
      console.log('Vite Config:', config);
      console.log('Environment:', env);
    },
  };
};
