declare namespace globalThis {
  let vitestGlobal: {
    log: (msg: string) => void;
    sleepFn: (ms?: number) => Promise<unknown>;
    all: { foo: string };
    main: {
      type: 'node';
    };
    renderer: {
      type: 'jsdom';
    };
  };
}
