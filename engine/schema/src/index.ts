export const schemaVersion = '0.1.0' as const;
export const contentIdPattern = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
export type ContentId = string;
export type MarkdownText = string;
export interface VersionedContent { id: ContentId; contentVersion: string; engineVersion: string; }
export interface Objective { id: ContentId; title: string; description?: MarkdownText; }
export interface DataReference { id: ContentId; subject: string; kind: string; value: unknown; }
export interface Block<TData = unknown> { id: ContentId; type: string; objectiveRefs: ContentId[]; dataRefs?: ContentId[]; data: TData; }
export type CompletionCondition =
  | { type: 'all-objectives' }
  | { type: 'required-blocks'; blockRefs: ContentId[] }
  | { type: 'minimum-score'; assessmentRefs: ContentId[]; score: number };
export interface Lesson { id: ContentId; title: string; summary?: MarkdownText; estimatedMinutes?: number; prerequisiteRefs?: ContentId[]; objectives: Objective[]; data?: DataReference[]; blocks: Block[]; completion: CompletionCondition; }
export interface Part { id: ContentId; title: string; description?: MarkdownText; lessons: Lesson[]; }
export interface Book extends VersionedContent { schemaVersion: typeof schemaVersion; subject: string; title: string; description?: MarkdownText; language: string; parts: Part[]; }
export interface EngineDocument extends VersionedContent { schemaVersion: typeof schemaVersion; }
export function isContentId(value: string): boolean { return contentIdPattern.test(value); }
export function assertContentId(value: string): asserts value is ContentId { if (!isContentId(value)) throw new Error(`Invalid content ID: ${value}`); }
export function collectBookIds(book: Book): string[] {
  return [book.id, ...book.parts.flatMap((part) => [part.id, ...part.lessons.flatMap((lesson) => [lesson.id, ...lesson.objectives.map((item) => item.id), ...(lesson.data ?? []).map((item) => item.id), ...lesson.blocks.map((item) => item.id)])])];
}
export function validateBookIdentity(book: Book): string[] {
  const ids = collectBookIds(book);
  const invalid = ids.filter((id) => !isContentId(id)).map((id) => `invalid:${id}`);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index).map((id) => `duplicate:${id}`);
  return [...new Set([...invalid, ...duplicates])];
}
