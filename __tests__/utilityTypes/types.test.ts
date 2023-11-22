import { expect, test } from 'vitest';

test('Utility types core test', () => {
  vitestGlobal.log('Inside the test...');
  expect(true).toBe(true);
  expect(process.env.NODE_ENV).toBe('test');
});
