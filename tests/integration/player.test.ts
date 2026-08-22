import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src/index';
import { findLesson, getLessonNavigation, loadBook } from '../../engine/player/src/index';
describe('data-driven player', () => {
  it('loads a book and finds the migrated lesson', () => { expect(findLesson(loadBook(harmonyBook), 'harmony.lesson.semitone')?.part.title).toBe('PART 1. 음'); });
  it('navigates in the order declared by content data', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.semitone')).toMatchObject({ previous: undefined, next: { id: 'harmony.lesson.interval' } }); });
  it('keeps later representative lessons reachable', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.interval').next?.id).toBe('harmony.lesson.triad'); });
  it('fails safely when a book has no lessons', () => { expect(() => loadBook({ ...harmonyBook, parts: [] })).toThrow('표시할 단원'); });
});
