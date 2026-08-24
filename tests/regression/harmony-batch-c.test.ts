import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { commonBlockKinds } from '../../engine/common-blocks/src';
import { validateBook } from '../../engine/schema/src';
import { pitchName, type Pitch } from '../../subjects/music/src';

const ids = ['harmony.part.diatonic', 'harmony.part.functions', 'harmony.part.cadences', 'harmony.part.progressions'];
const lessons = harmonyBook.parts.filter((part) => ids.includes(part.id)).flatMap((part) => part.lessons);

describe('Harmony batch C migration', () => {
  it('contains all PART 6-9 lessons in RC1 order', () => {
    expect(lessons.map((lesson) => lesson.title.split('.')[0])).toEqual(['6-1','6-2','6-3','6-4','7-1','7-2','7-3','7-4','7-5','8-1','8-2','8-3','8-4','8-5','9-1','9-2','9-3','9-4','9-5']);
    expect(lessons).toHaveLength(19);
  });
  it('gives every lesson an activity and explicit completion rule', () => {
    for (const lesson of lessons) {
      expect(lesson.blocks.some((block) => block.type === 'activity.subject')).toBe(true);
      expect(lesson.completion.type).toBe('required-blocks');
    }
  });
  it('preserves the raised leading tone in the A minor dominant', () => {
    const item = lessons.find((lesson) => lesson.id === 'harmony.lesson.minor-diatonic.lesson');
    const groups = item?.data?.[0].value as Pitch[][];
    expect(groups.flat().map(pitchName)).toContain('G♯4');
  });
  it('keeps all four cadence types before the listening lesson', () => {
    expect(lessons.slice(9, 14).map((lesson) => lesson.id)).toEqual(['harmony.lesson.authentic-cadence.lesson','harmony.lesson.half-cadence.lesson','harmony.lesson.plagal-cadence.lesson','harmony.lesson.deceptive-cadence.lesson','harmony.lesson.cadence']);
  });
  it('passes schema, ID, reference and block validation', () => {
    expect(validateBook(harmonyBook, { supportedBlockTypes: commonBlockKinds })).toEqual([]);
  });
});
