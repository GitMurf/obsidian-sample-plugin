import { randomUUID } from 'node:crypto';

export function getRandomUuid(): string {
  return randomUUID();
}
