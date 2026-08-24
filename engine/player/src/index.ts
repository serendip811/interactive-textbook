import { validateBook, type Block, type Book, type ContentId, type Lesson, type Part } from '@interactive-textbook/schema';

export const engineAreas = ['content', 'rendering', 'navigation', 'events'] as const;
export type EngineArea = (typeof engineAreas)[number];

export interface ViewInput<TData = unknown, TState = unknown> { data: TData; state: TState; disabled?: boolean; }
export interface ViewOutput<TPayload = unknown> { type: string; payload: TPayload; }
export type ActivityStatus = 'idle' | 'active' | 'submitted' | 'completed';
export interface ActivityState<TResponse = unknown> { status: ActivityStatus; attempts: number; response?: TResponse; }
export type ActivityEvent<TResponse = unknown> =
  | { type: 'start' } | { type: 'change'; response: TResponse }
  | { type: 'submit'; response: TResponse } | { type: 'complete' } | { type: 'reset' };

export interface Feedback { tone: 'success' | 'error' | 'info'; title: string; message: string; details?: string[]; }
export interface ValidationResult { correct: boolean; score: number; feedback: Feedback; }
export interface Validator<TResponse = unknown, TContext = unknown> { validate(response: TResponse, context: TContext): ValidationResult; }

export interface LearningRecord<TValue = unknown> { learnerId: string; contentId: ContentId; updatedAt: string; value: TValue; }
export interface LearningStateRepository {
  load<TValue>(learnerId: string, contentId: ContentId): Promise<LearningRecord<TValue> | null>;
  save<TValue>(record: LearningRecord<TValue>): Promise<void>;
  remove(learnerId: string, contentId: ContentId): Promise<void>;
}

export interface SubjectTool<TInput = unknown, TOutput = unknown> {
  subject: string;
  kind: string;
  version?: string;
  engineVersion?: string;
  run(input: TInput): TOutput;
  validateInput?: (input: unknown) => input is TInput;
  accessibleSummary?: (input: TInput) => string;
}
export class SubjectToolRegistry {
  private readonly tools = new Map<string, SubjectTool>();
  register(tool: SubjectTool): void {
    const key = `${tool.subject}:${tool.kind}`;
    if (this.tools.has(key)) throw new Error(`Subject tool already registered: ${key}`);
    this.tools.set(key, tool);
  }
  resolve(subject: string, kind: string): SubjectTool | undefined { return this.tools.get(`${subject}:${kind}`); }
  list(subject?: string): SubjectTool[] { return [...this.tools.values()].filter((tool) => !subject || tool.subject === subject); }
}

export type EngineEvent =
  | { type: 'activity.completed'; activityId: ContentId; timestamp: string }
  | { type: 'assessment.submitted'; assessmentId: ContentId; result: ValidationResult; timestamp: string }
  | { type: 'playback.started' | 'playback.paused' | 'playback.stopped'; sourceId: ContentId; sessionId: string; timestamp: string };

export interface PlaybackSession { id: string; sourceId: ContentId; signal: AbortSignal; }
export class PlaybackSessionController {
  private active?: { id: string; sourceId: ContentId; controller: AbortController };
  start(sourceId: ContentId): PlaybackSession {
    this.stop();
    const controller = new AbortController();
    const id = `${sourceId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.active = { id, sourceId, controller };
    return { id, sourceId, signal: controller.signal };
  }
  stop(): void { this.active?.controller.abort(); this.active = undefined; }
  get activeSessionId(): string | undefined { return this.active?.id; }
}

export interface LessonLocation { part: Part; lesson: Lesson; partIndex: number; lessonIndex: number; flatIndex: number; }
export interface LessonNavigation { previous?: Lesson; next?: Lesson; }
export function flattenLessons(book: Book): Lesson[] { return book.parts.flatMap((part) => part.lessons); }
export function findLesson(book: Book, id: ContentId): LessonLocation | undefined {
  let flatIndex = 0;
  for (const [partIndex, part] of book.parts.entries()) {
    for (const [lessonIndex, lesson] of part.lessons.entries()) {
      if (lesson.id === id) return { part, lesson, partIndex, lessonIndex, flatIndex };
      flatIndex += 1;
    }
  }
  return undefined;
}
export function getLessonNavigation(book: Book, id: ContentId): LessonNavigation {
  const lessons = flattenLessons(book);
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return index < 0 ? {} : { previous: lessons[index - 1], next: lessons[index + 1] };
}
export function loadBook(input: Book): Book {
  if (!input.parts.length || !flattenLessons(input).length) throw new Error('교재에 표시할 단원이 없습니다.');
  const issues = validateBook(input);
  if (issues.length) throw new Error(`교재 콘텐츠 검증에 실패했습니다: ${issues[0].message}`);
  return input;
}
export type BlockRendererContract = (block: Block) => unknown;
