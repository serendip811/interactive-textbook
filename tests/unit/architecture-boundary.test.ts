import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
describe('engine subject boundary', () => {
  it('keeps music imports out of common engine packages', () => { const files = globSync('engine/**/*.ts'); const offenders = files.filter((file) => readFileSync(file, 'utf8').includes('@interactive-textbook/subject-music')); expect(offenders).toEqual([]); });
});
