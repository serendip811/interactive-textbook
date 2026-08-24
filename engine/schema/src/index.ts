export const schemaVersion = '0.2.0' as const;
export const blockVersion = '1.0.0' as const;
export const contentIdPattern = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
export const semanticVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export type ContentId = string;
export type MarkdownText = string;
export interface VersionedContent { id: ContentId; contentVersion: string; engineVersion: string; }
export interface Objective { id: ContentId; title: string; description?: MarkdownText; }
export interface DataReference { id: ContentId; subject: string; kind: string; value: unknown; }
export interface Block<TData = unknown> { id: ContentId; type: string; blockVersion: typeof blockVersion; objectiveRefs: ContentId[]; dataRefs?: ContentId[]; data: TData; }
export type CompletionCondition =
  | { type: 'all-objectives' }
  | { type: 'required-blocks'; blockRefs: ContentId[] }
  | { type: 'minimum-score'; assessmentRefs: ContentId[]; score: number };
export interface Lesson { id: ContentId; title: string; summary?: MarkdownText; estimatedMinutes?: number; prerequisiteRefs?: ContentId[]; objectives: Objective[]; data?: DataReference[]; blocks: Block[]; completion: CompletionCondition; }
export interface Part { id: ContentId; title: string; description?: MarkdownText; lessons: Lesson[]; }
export interface Book extends VersionedContent { schemaVersion: typeof schemaVersion; subject: string; title: string; description?: MarkdownText; language: string; parts: Part[]; }
export interface EngineDocument extends VersionedContent { schemaVersion: typeof schemaVersion; }

export type ValidationIssueCode =
  | 'invalid-id' | 'duplicate-id' | 'unsupported-schema-version' | 'unsupported-block-version'
  | 'invalid-content-version' | 'invalid-engine-version' | 'broken-reference' | 'unsupported-block'
  | 'invalid-choice-answer' | 'missing-accessible-name' | 'broken-asset';
export interface ValidationIssue { code: ValidationIssueCode; path: string; message: string; }
export interface ValidationOptions { supportedBlockTypes?: readonly string[]; }

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

function referenceIssue(path: string, reference: string): ValidationIssue {
  return { code: 'broken-reference', path, message: `존재하지 않는 참조입니다: ${reference}` };
}

export function validateBook(book: Book, options: ValidationOptions = {}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = collectBookIds(book);
  ids.forEach((id, index) => {
    if (!isContentId(id)) issues.push({ code: 'invalid-id', path: `ids[${index}]`, message: `ID 규칙에 맞지 않습니다: ${id}` });
    if (ids.indexOf(id) !== index) issues.push({ code: 'duplicate-id', path: `ids[${index}]`, message: `중복 ID입니다: ${id}` });
  });
  if (book.schemaVersion !== schemaVersion) issues.push({ code: 'unsupported-schema-version', path: 'schemaVersion', message: `지원하지 않는 스키마 버전입니다: ${book.schemaVersion}` });
  if (!semanticVersionPattern.test(book.contentVersion)) issues.push({ code: 'invalid-content-version', path: 'contentVersion', message: `콘텐츠 버전은 SemVer여야 합니다: ${book.contentVersion}` });
  if (!semanticVersionPattern.test(book.engineVersion)) issues.push({ code: 'invalid-engine-version', path: 'engineVersion', message: `엔진 요구 버전은 SemVer여야 합니다: ${book.engineVersion}` });

  const lessonIds = new Set(book.parts.flatMap((part) => part.lessons.map((lesson) => lesson.id)));
  book.parts.forEach((part, partIndex) => part.lessons.forEach((lesson, lessonIndex) => {
    const lessonPath = `parts[${partIndex}].lessons[${lessonIndex}]`;
    const objectiveIds = new Set(lesson.objectives.map((objective) => objective.id));
    const dataIds = new Set((lesson.data ?? []).map((data) => data.id));
    const blockIds = new Set(lesson.blocks.map((block) => block.id));
    lesson.prerequisiteRefs?.forEach((ref, index) => { if (!lessonIds.has(ref)) issues.push(referenceIssue(`${lessonPath}.prerequisiteRefs[${index}]`, ref)); });
    lesson.data?.forEach((data, dataIndex) => {
      if (data.kind === 'asset') {
        const value = data.value as { src?: unknown };
        if (typeof value?.src !== 'string' || !value.src.trim()) issues.push({ code: 'broken-asset', path: `${lessonPath}.data[${dataIndex}].value.src`, message: '에셋 경로가 비어 있습니다.' });
      }
    });
    lesson.blocks.forEach((block, blockIndex) => {
      const blockPath = `${lessonPath}.blocks[${blockIndex}]`;
      if (block.blockVersion !== blockVersion) issues.push({ code: 'unsupported-block-version', path: `${blockPath}.blockVersion`, message: `지원하지 않는 블록 버전입니다: ${block.blockVersion}` });
      if (options.supportedBlockTypes && !options.supportedBlockTypes.includes(block.type)) issues.push({ code: 'unsupported-block', path: `${blockPath}.type`, message: `등록되지 않은 블록 형식입니다: ${block.type}` });
      block.objectiveRefs.forEach((ref, index) => { if (!objectiveIds.has(ref)) issues.push(referenceIssue(`${blockPath}.objectiveRefs[${index}]`, ref)); });
      block.dataRefs?.forEach((ref, index) => { if (!dataIds.has(ref)) issues.push(referenceIssue(`${blockPath}.dataRefs[${index}]`, ref)); });
      if (block.type === 'assessment.multiple-choice') {
        const data = block.data as { answer?: string; options?: Array<{ id: string }> };
        if (!data.answer || !data.options?.some((option) => option.id === data.answer)) issues.push({ code: 'invalid-choice-answer', path: `${blockPath}.data.answer`, message: '객관식 정답이 선택지에 없습니다.' });
      }
      if (block.type === 'activity.subject') {
        const data = block.data as { title?: string };
        if (!data.title?.trim()) issues.push({ code: 'missing-accessible-name', path: `${blockPath}.data.title`, message: '활동에는 접근 가능한 제목이 필요합니다.' });
      }
    });
    if (lesson.completion.type === 'required-blocks') lesson.completion.blockRefs.forEach((ref, index) => { if (!blockIds.has(ref)) issues.push(referenceIssue(`${lessonPath}.completion.blockRefs[${index}]`, ref)); });
    if (lesson.completion.type === 'minimum-score') lesson.completion.assessmentRefs.forEach((ref, index) => { if (!blockIds.has(ref)) issues.push(referenceIssue(`${lessonPath}.completion.assessmentRefs[${index}]`, ref)); });
  }));
  return issues.filter((issue, index) => issues.findIndex((candidate) => candidate.code === issue.code && candidate.path === issue.path && candidate.message === issue.message) === index);
}

/** One-way migration for 0.1 content. Source objects are never mutated. */
export function migrateBookFrom010(source: unknown): Book {
  const book = structuredClone(source) as Record<string, unknown>;
  if (book.schemaVersion !== '0.1.0') throw new Error('Only schema 0.1.0 can be migrated with migrateBookFrom010');
  book.schemaVersion = schemaVersion;
  const parts = book.parts as Array<{ lessons: Array<{ blocks: Array<Record<string, unknown>> }> }>;
  parts.forEach((part) => part.lessons.forEach((lesson) => lesson.blocks.forEach((block) => { block.blockVersion = blockVersion; })));
  return book as unknown as Book;
}
