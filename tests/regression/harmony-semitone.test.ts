import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { intervalSemitones, pitchName, type Pitch } from '../../subjects/music/src';
const lesson = harmonyBook.parts[0].lessons[0];
const pairs = (lesson.data?.find((item) => item.id === 'harmony.data.semitone.natural')?.value ?? []) as Pitch[][];
describe('RC1 1-2 migration', () => {
  it('preserves the RC1 natural semitone examples', () => { expect(pairs.map((pair) => pair.map(pitchName).join('–'))).toEqual(['E4–F4', 'B4–C5']); expect(pairs.map((pair) => intervalSemitones(pair[0], pair[1]))).toEqual([1, 1]); });
  it('uses one objective across every lesson block', () => { expect(lesson.blocks.every((block) => block.objectiveRefs.includes('harmony.objective.semitone'))).toBe(true); });
  it('requires both interaction and assessment for completion', () => { expect(lesson.completion).toEqual({ type: 'required-blocks', blockRefs: ['harmony.block.semitone.explorer', 'harmony.block.semitone.check'] }); });
});
