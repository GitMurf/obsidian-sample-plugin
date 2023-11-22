// src/main/main.ts

import { describe, expect, it } from 'vitest';

describe('main.ts startup Electron modules', () => {
  it('Hello world check', () => {
    expect(true).toBe(true);
  });

  it('global variable "foo" has been change to', () => {
    expect(vitestGlobal.all.foo).toBe('new update here!');
  });

  it('NODE_ENV should be set as "test" for testing', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
