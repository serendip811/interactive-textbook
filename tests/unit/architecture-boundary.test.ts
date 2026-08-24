import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
describe('engine subject boundary', () => {
  it('keeps subject imports out of common engine packages', () => {
    const files = globSync('engine/**/*.ts');
    const offenders = files.filter((file) => /@interactive-textbook\/subject-(music|math)/.test(readFileSync(file, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('keeps music and math subject packages independent', () => {
    const musicFiles = globSync('subjects/music/**/*.ts');
    const mathFiles = globSync('subjects/math/**/*.ts');
    expect(musicFiles.filter((file) => readFileSync(file, 'utf8').includes('subject-math'))).toEqual([]);
    expect(mathFiles.filter((file) => readFileSync(file, 'utf8').includes('subject-music'))).toEqual([]);
  });
});
