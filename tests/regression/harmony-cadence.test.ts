import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { cadenceFeedback, type CadenceProgression } from '../../subjects/music/src';
const lesson = harmonyBook.parts.flatMap((part) => part.lessons).find((item) => item.id === 'harmony.lesson.cadence');
describe('cadence representative lesson', () => {
  it('defines timed authentic and half cadence examples', () => { const progressions = lesson?.data?.find((item) => item.id === 'harmony.data.cadence.examples')?.value as CadenceProgression[]; expect(progressions.map((item) => item.cadenceType)).toEqual(['authentic', 'half']); expect(progressions.every((item) => item.steps.every((step) => step.durationMs > 0))).toBe(true); });
  it('uses a distinct hidden-analysis progression for the listener', () => { const block = lesson?.blocks.find((item) => item.id === 'harmony.block.cadence.listener'); const input = (block?.data as { input: { hideAnalysisUntilAnswer?: boolean } }).input; const examples = lesson?.data?.find((item) => item.id === 'harmony.data.cadence.examples')?.value as CadenceProgression[]; const quiz = lesson?.data?.find((item) => item.id === 'harmony.data.cadence.quiz')?.value as CadenceProgression[]; expect(input.hideAnalysisUntilAnswer).toBe(true); expect(block?.dataRefs).toEqual(['harmony.data.cadence.quiz']); expect(quiz[0].id).not.toBe(examples[0].id); expect(quiz[0].steps[0].chord.pitches).not.toEqual(examples[0].steps[0].chord.pitches); });
  it('only asks learners to choose between the two taught cadence types', () => { const block = lesson?.blocks.find((item) => item.id === 'harmony.block.cadence.listener'); const input = (block?.data as { input: { answerTypes?: string[] } }).input; expect(input.answerTypes).toEqual(['authentic', 'half']); });
  it('gives cadence-specific feedback', () => { expect(cadenceFeedback('authentic', 'authentic').correct).toBe(true); expect(cadenceFeedback('authentic', 'half').message).toContain('반종지'); });
});
