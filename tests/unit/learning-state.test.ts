import { describe, expect, it } from 'vitest';
import { clearBookProgress, emptyBookProgress, loadBookProgress, progressKey, saveBookProgress, updateLessonProgress } from '../../engine/learning-state/src';
class MemoryStorage { values = new Map<string, string>(); getItem(key: string) { return this.values.get(key) ?? null; } setItem(key: string, value: string) { this.values.set(key, value); } removeItem(key: string) { this.values.delete(key); } }
describe('local learning state', () => {
  it('restores matching content versions', () => { const storage = new MemoryStorage(); const progress = updateLessonProgress(emptyBookProgress('harmony', '0.2.0'), 'lesson.one', { status: 'started', lastBlockId: 'block.one' }); saveBookProgress(storage, progress); expect(loadBookProgress(storage, 'harmony', '0.2.0').lessons['lesson.one'].lastBlockId).toBe('block.one'); });
  it('resets incompatible content versions', () => { const storage = new MemoryStorage(); saveBookProgress(storage, emptyBookProgress('harmony', '0.1.0')); expect(loadBookProgress(storage, 'harmony', '0.2.0').contentVersion).toBe('0.2.0'); });
  it('clears a book without touching other keys', () => { const storage = new MemoryStorage(); saveBookProgress(storage, emptyBookProgress('harmony', '0.2.0')); clearBookProgress(storage, 'harmony'); expect(storage.getItem(progressKey('harmony'))).toBeNull(); });
  it('stores math activity responses without a subject-specific state shape', () => {
    const storage = new MemoryStorage();
    const initial = emptyBookProgress('functions', '0.1.0');
    const next = updateLessonProgress(initial, 'functions.lesson.coordinates', {
      status: 'completed',
      activities: {
        'functions.activity.point': {
          response: { x: 2, y: 3 }, correct: true, attempts: 1, completed: true, updatedAt: '2026-08-24T00:00:00.000Z',
        },
      },
      assessments: {},
    });
    saveBookProgress(storage, next);
    const restored = loadBookProgress(storage, 'functions', '0.1.0');
    expect(restored.lessons['functions.lesson.coordinates'].activities['functions.activity.point'].response).toEqual({ x: 2, y: 3 });
  });
});
