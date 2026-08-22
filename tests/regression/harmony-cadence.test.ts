import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { cadenceFeedback, type CadenceProgression } from '../../subjects/music/src';
const lesson = harmonyBook.parts[0].lessons.find((item) => item.id === 'harmony.lesson.cadence');
describe('cadence representative lesson', () => {
  it('defines timed authentic and half cadences', () => { const progressions = lesson?.data?.[0].value as CadenceProgression[]; expect(progressions.map((item) => item.cadenceType)).toEqual(['authentic', 'half']); expect(progressions.every((item) => item.steps.every((step) => step.durationMs > 0))).toBe(true); });
  it('gives cadence-specific feedback', () => { expect(cadenceFeedback('authentic', 'authentic').correct).toBe(true); expect(cadenceFeedback('authentic', 'half').message).toContain('반종지'); });
});
