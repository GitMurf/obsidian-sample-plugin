// before each test. beforeAll runs once per test file whereas beforeEach runs once per unit test
// not called when vitest is doing type checking: https://vitest.dev/api/#setup-and-teardown

import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

const DEBUG_LOG = false;

beforeAll(async () => {
  setGlobals();
  // await vitestGlobal.sleepFn(1_000);
  vitestGlobal.log('setupEachTest.ts: beforeAll END');
});

beforeEach(() => {
  vitestGlobal.log(`setupEachTest.ts: beforeEach START: ${new Date().toISOString()}`);
  vitestGlobal.all.foo = 'new update here!';
});

afterEach(() => {
  vitestGlobal.log(`setupEachTest.ts: afterEach START: ${new Date().toISOString()}`);
});

afterAll(async () => {
  // await vitestGlobal.sleepFn(1_000);
  vitestGlobal.log(`setupEachTest.ts: afterAll END: ${new Date().toISOString()}`);
});

function setGlobals() {
  // @ts-expect-error globalThis trickiness
  globalThis.vitestGlobal = {
    log: (msg: string) => {
      if (DEBUG_LOG) {
        console.log(msg);
      }
    },
    sleepFn: async (ms = 1000) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    all: { foo: 'bar' },
    main: {
      type: 'node',
    },
    renderer: {
      type: 'jsdom',
    },
  };
}
