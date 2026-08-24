import { describe, expect, it } from 'vitest';
import { commonBlockKinds } from '../../engine/common-blocks/src';
import { engineAreas } from '../../engine/player/src';
import { schemaVersion } from '../../engine/schema/src';

describe('Phase 1 foundation', () => {
  it('exposes the initial schema version', () => {
    expect(schemaVersion).toBe('0.2.0');
  });

  it('keeps common blocks independent from subject blocks', () => {
    expect(commonBlockKinds).toContain('content.markdown');
    expect(commonBlockKinds.every((kind) => !kind.startsWith('music.'))).toBe(true);
  });

  it('defines the minimum player areas', () => {
    expect(engineAreas).toEqual(['content', 'rendering', 'navigation', 'events']);
  });
});
