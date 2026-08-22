import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { createInterval } from '../../subjects/music/src';
const lesson = harmonyBook.parts[0].lessons.find((item) => item.id === 'harmony.lesson.interval');
describe('interval representative lesson', () => {
  it('is present with a target-building activity', () => { expect(lesson?.blocks.some((block) => block.id === 'harmony.block.interval.builder')).toBe(true); });
  it('distinguishes enharmonic spelling by degree', () => { const C4 = { step: 'C', alter: 0, octave: 4 } as const; expect(createInterval(C4, { step: 'C', alter: 1, octave: 4 })).toMatchObject({ degree: 1, semitones: 1, quality: 'augmented' }); expect(createInterval(C4, { step: 'D', alter: -1, octave: 4 })).toMatchObject({ degree: 2, semitones: 1, quality: 'minor' }); });
});
