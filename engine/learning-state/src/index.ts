export interface LearningStateStore { read(key: string): Promise<unknown>; write(key: string, value: unknown): Promise<void>; remove(key: string): Promise<void>; }
export interface ActivityProgress { response: unknown; correct: boolean; attempts: number; completed: boolean; updatedAt: string; }
export interface LessonProgress { status: 'not-started' | 'started' | 'completed'; lastBlockId?: string; activities: Record<string, ActivityProgress>; assessments: Record<string, ActivityProgress>; updatedAt: string; }
export interface BookProgress { schemaVersion: 1; bookId: string; contentVersion: string; currentLessonId?: string; lessons: Record<string, LessonProgress>; }
export const progressKey = (bookId: string) => `interactive-textbook:progress:${bookId}`;
export function emptyBookProgress(bookId: string, contentVersion: string): BookProgress { return { schemaVersion: 1, bookId, contentVersion, lessons: {} }; }
export function loadBookProgress(storage: Pick<Storage, 'getItem'>, bookId: string, contentVersion: string): BookProgress {
  try { const value = storage.getItem(progressKey(bookId)); if (!value) return emptyBookProgress(bookId, contentVersion); const parsed = JSON.parse(value) as BookProgress; return parsed.schemaVersion === 1 && parsed.bookId === bookId && parsed.contentVersion === contentVersion ? parsed : emptyBookProgress(bookId, contentVersion); } catch { return emptyBookProgress(bookId, contentVersion); }
}
export function saveBookProgress(storage: Pick<Storage, 'setItem'>, progress: BookProgress): void { storage.setItem(progressKey(progress.bookId), JSON.stringify(progress)); }
export function clearBookProgress(storage: Pick<Storage, 'removeItem'>, bookId: string): void { storage.removeItem(progressKey(bookId)); }
export function updateLessonProgress(progress: BookProgress, lessonId: string, update: Partial<LessonProgress>): BookProgress {
  const previous = progress.lessons[lessonId] ?? { status: 'not-started', activities: {}, assessments: {}, updatedAt: new Date(0).toISOString() };
  return { ...progress, currentLessonId: lessonId, lessons: { ...progress.lessons, [lessonId]: { ...previous, ...update, updatedAt: new Date().toISOString() } } };
}
