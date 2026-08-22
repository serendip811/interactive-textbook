import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src/index';
import { findLesson, getLessonNavigation, loadBook } from '../../engine/player/src/index';
describe('data-driven player', () => {
  it('loads a book and finds a lesson', () => { expect(findLesson(loadBook(harmonyBook), 'harmony.lesson.pitch')?.part.title).toBe('음의 기초'); });
  it('navigates between flattened lessons', () => { expect(getLessonNavigation(harmonyBook, 'harmony.lesson.pitch').next?.id).toBe('harmony.lesson.semitone'); });
  it('fails safely when a book has no lessons', () => { expect(() => loadBook({ ...harmonyBook, parts: [] })).toThrow('표시할 단원'); });
});
