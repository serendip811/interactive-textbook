import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { flattenLessons } from '../../engine/player/src';
import { validateBook } from '../../engine/schema/src';
import { commonBlockKinds } from '../../engine/common-blocks/src';

const batchA = harmonyBook.parts.filter((part) => ['harmony.part.introduction', 'harmony.part.pitch', 'harmony.part.intervals'].includes(part.id));
const lessons = batchA.flatMap((part) => part.lessons);

describe('Harmony batch A migration', () => {
  it('contains all PART 0-2 lessons in RC1 order', () => {
    expect(lessons.map((lesson) => lesson.title.split('.')[0])).toEqual(['0-1', '0-2', '1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6']);
    expect(lessons).toHaveLength(12);
  });
  it('gives every migrated lesson a goal, meaning data and a completion check', () => {
    for (const lesson of lessons) {
      expect(lesson.objectives.length).toBeGreaterThan(0);
      expect(lesson.data?.length).toBeGreaterThan(0);
      expect(lesson.blocks.some((block) => block.type === 'activity.subject')).toBe(true);
      expect(lesson.completion.type).toBe('required-blocks');
    }
  });
  it('keeps the whole book valid and retains later representative lessons', () => {
    expect(validateBook(harmonyBook, { supportedBlockTypes: commonBlockKinds })).toEqual([]);
    expect(flattenLessons(harmonyBook).map((lesson) => lesson.id)).toEqual(expect.arrayContaining(['harmony.lesson.triad', 'harmony.lesson.cadence', 'harmony.lesson.voice-leading']));
  });
});
