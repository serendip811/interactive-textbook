import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src/index';
import { functionsBook } from '../../books/functions/src/index';
import { findLesson, flattenLessons, getLessonNavigation, loadBook } from '../../engine/player/src/index';
describe('data-driven player', () => {
  it('loads a book and finds the migrated lesson', () => { expect(findLesson(loadBook(harmonyBook), 'harmony.lesson.semitone')?.part.title).toBe('PART 1. 음'); });
  it('navigates in the order declared by content data', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.semitone')).toMatchObject({ previous: undefined, next: { id: 'harmony.lesson.interval' } }); });
  it('keeps later representative lessons reachable', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.interval').next?.id).toBe('harmony.lesson.triad'); });
  it('reaches cadence after the triad lesson', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.triad').next?.id).toBe('harmony.lesson.cadence'); });
  it('reaches voice leading after cadence', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.cadence').next?.id).toBe('harmony.lesson.voice-leading'); });
  it('loads the functions book and navigates all five lessons', () => { const book = loadBook(functionsBook); expect(flattenLessons(book)).toHaveLength(5); expect(getLessonNavigation(book, 'functions.lesson.coordinates').next?.id).toBe('functions.lesson.input-output'); expect(getLessonNavigation(book, 'functions.lesson.intersection').next).toBeUndefined(); });
  it('fails safely when a book has no lessons', () => { expect(() => loadBook({ ...harmonyBook, parts: [] })).toThrow('표시할 단원'); });
});
