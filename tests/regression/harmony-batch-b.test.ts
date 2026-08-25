import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { commonBlockKinds } from '../../engine/common-blocks/src';
import { validateBook } from '../../engine/schema/src';
import { pitchName, type Pitch } from '../../subjects/music/src';

const parts = harmonyBook.parts.filter((part) => ['harmony.part.keys', 'harmony.part.chords', 'harmony.part.seventh-chords'].includes(part.id));
const lessons = parts.flatMap((part) => part.lessons);
const allLessons = harmonyBook.parts.flatMap((part) => part.lessons);

describe('Harmony batch B migration', () => {
  it('contains all PART 3-5 lessons in RC1 order', () => {
    expect(lessons.map((lesson) => lesson.title.split('.')[0])).toEqual(['3-1', '3-2', '3-3', '3-4', '3-5', '4-1', '4-2', '4-3', '4-4', '5-1', '5-2', '5-3', '5-4']);
    expect(lessons).toHaveLength(13);
  });
  it('gives every lesson meaning data, an activity and an explicit completion rule', () => {
    for (const lesson of lessons) {
      expect(lesson.data?.length).toBeGreaterThan(0);
      expect(lesson.blocks.some((block) => block.type === 'activity.subject')).toBe(true);
      expect(lesson.completion.type).toBe('required-blocks');
    }
  });
  it('preserves the raised seventh in A harmonic minor', () => {
    const lesson = allLessons.find((item) => item.id === 'harmony.lesson.minor-key.lesson');
    const groups = lesson?.data?.[0].value as Pitch[][];
    expect(groups.flat().map(pitchName)).toContain('G♯5');
  });
  it('preserves the G7 resolution tendency F-E and B-C', () => {
    const lesson = allLessons.find((item) => item.id === 'harmony.lesson.seventh-resolution.lesson');
    const groups = lesson?.data?.[0].value as Pitch[][];
    expect(groups.map((group) => group.map(pitchName))).toEqual([['G3', 'B3', 'D4', 'F4'], ['C4', 'E4', 'G4']]);
    const activity = lesson?.blocks.find((block) => block.type === 'activity.subject');
    expect((activity?.data as { input: { playbackMode?: string } }).input.playbackMode).toBe('progression');
  });
  it('passes schema, ID, reference and block validation', () => {
    expect(validateBook(harmonyBook, { supportedBlockTypes: commonBlockKinds })).toEqual([]);
  });
});
