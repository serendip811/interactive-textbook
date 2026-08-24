import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src/index';
import { functionsBook } from '../../books/functions/src/index';
import { findLesson, flattenLessons, getLessonNavigation, loadBook } from '../../engine/player/src/index';
describe('data-driven player', () => {
  it('loads a book and finds the migrated lesson', () => { expect(findLesson(loadBook(harmonyBook), 'harmony.lesson.semitone')?.part.title).toBe('PART 1. 음'); });
  it('navigates in the order declared by content data', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.semitone')).toMatchObject({ previous: { id: 'harmony.lesson.pitch-properties.lesson' }, next: { id: 'harmony.lesson.accidentals.lesson' } }); });
  it('keeps the complete interval sequence reachable', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.interval')).toMatchObject({ previous: { id: 'harmony.lesson.interval-degree.lesson' }, next: { id: 'harmony.lesson.compound-interval.lesson' } }); });
  it('reaches batch B after the final batch A lesson', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.consonance.lesson').next?.id).toBe('harmony.lesson.major-key.lesson'); });
  it('continues to inversion after the representative triad', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.triad').next?.id).toBe('harmony.lesson.triad-inversion.lesson'); });
  it('reaches batch C after the final seventh-chord lesson', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.seventh-resolution.lesson').next?.id).toBe('harmony.lesson.major-diatonic.lesson'); });
  it('continues from cadence into progression lessons', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.cadence').next?.id).toBe('harmony.lesson.basic-progression.lesson'); });
  it('reaches voice leading after batch C', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.common-progressions.lesson').next?.id).toBe('harmony.lesson.voice-leading'); });
  it('loads batches A-C and the remaining representative lesson', () => { expect(flattenLessons(loadBook(harmonyBook))).toHaveLength(45); });
  it('loads the functions book and navigates all five lessons', () => { const book = loadBook(functionsBook); expect(flattenLessons(book)).toHaveLength(5); expect(getLessonNavigation(book, 'functions.lesson.coordinates').next?.id).toBe('functions.lesson.input-output'); expect(getLessonNavigation(book, 'functions.lesson.intersection').next).toBeUndefined(); });
  it('fails safely when a book has no lessons', () => { expect(() => loadBook({ ...harmonyBook, parts: [] })).toThrow('표시할 단원'); });
});
