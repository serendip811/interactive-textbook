import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src/index';
import { findLesson, getLessonNavigation, loadBook } from '../../engine/player/src/index';
describe('data-driven player', () => {
  it('loads a book and finds the migrated lesson', () => { expect(findLesson(loadBook(harmonyBook), 'harmony.lesson.semitone')?.part.title).toBe('PART 1. 음'); });
  it('handles navigation boundaries for a one-lesson book', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.semitone')).toEqual({ previous: undefined, next: undefined }); });
  it('fails safely when a book has no lessons', () => { expect(() => loadBook({ ...harmonyBook, parts: [] })).toThrow('표시할 단원'); });
});
