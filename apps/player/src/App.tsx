import { useMemo, useState } from 'react';
import { harmonyBook } from '@interactive-textbook/book-harmony';
import { findLesson, flattenLessons, getLessonNavigation, loadBook } from '@interactive-textbook/engine-player';
import { BlockRenderer } from './BlockRenderer';
import { clearBookProgress, emptyBookProgress, loadBookProgress, saveBookProgress, updateLessonProgress, type ActivityProgress, type BookProgress } from '@interactive-textbook/learning-state';

export function App() {
  const result = useMemo(() => { try { return { book: loadBook(harmonyBook) }; } catch (error) { return { error: error instanceof Error ? error.message : '알 수 없는 오류' }; } }, []);
  const firstLesson = result.book ? flattenLessons(result.book)[0] : undefined;
  const initialProgress = useMemo(() => result.book && typeof localStorage !== 'undefined' ? loadBookProgress(localStorage, result.book.id, result.book.contentVersion) : result.book ? emptyBookProgress(result.book.id, result.book.contentVersion) : undefined, [result.book]);
  const [progress, setProgress] = useState<BookProgress | undefined>(initialProgress);
  const [currentId, setCurrentId] = useState(initialProgress?.currentLessonId ?? firstLesson?.id ?? '');
  if (!result.book) return <main className="fatal" role="alert"><h1>교재를 열 수 없습니다.</h1><p>{result.error}</p></main>;
  const location = findLesson(result.book, currentId);
  if (!location) return <main className="fatal" role="alert"><h1>단원을 찾을 수 없습니다.</h1><button onClick={() => setCurrentId(firstLesson?.id ?? '')}>첫 단원으로 이동</button></main>;
  const navigation = getLessonNavigation(result.book, currentId);
  const record = (blockId: string, kind: 'visit' | 'activity' | 'assessment', value?: unknown) => setProgress((current) => {
    if (!current) return current; const prior = current.lessons[currentId]; const activity = value as { response?: unknown; pitches?: unknown; correct?: boolean; attempts?: number } | undefined; const item: ActivityProgress | undefined = activity ? { response: activity.response ?? activity.pitches, correct: Boolean(activity.correct), attempts: activity.attempts ?? 1, completed: Boolean(activity.correct), updatedAt: new Date().toISOString() } : undefined;
    const activities = kind === 'activity' && item ? { ...(prior?.activities ?? {}), [blockId]: item } : (prior?.activities ?? {}); const assessments = kind === 'assessment' && item ? { ...(prior?.assessments ?? {}), [blockId]: item } : (prior?.assessments ?? {}); const completed = Boolean(activities['harmony.block.semitone.explorer']?.completed && assessments['harmony.block.semitone.check']); const next = updateLessonProgress(current, currentId, { status: completed ? 'completed' : 'started', lastBlockId: blockId, activities, assessments }); saveBookProgress(localStorage, next); return next;
  });
  return <div className="app-shell">
    <aside className="toc" aria-label="교재 목차"><div className="brand"><span>INTERACTIVE BOOK</span><strong>{result.book.title}</strong></div>{result.book.parts.map((part) => <section key={part.id}><h2>{part.title}</h2><ol>{part.lessons.map((lesson) => <li key={lesson.id}><button className={lesson.id === currentId ? 'active' : ''} aria-current={lesson.id === currentId ? 'page' : undefined} onClick={() => setCurrentId(lesson.id)}>{progress?.lessons[lesson.id]?.status === 'completed' ? '✓ ' : ''}{lesson.title}</button></li>)}</ol></section>)}<button className="reset-progress" onClick={() => { clearBookProgress(localStorage, result.book.id); const reset = emptyBookProgress(result.book.id, result.book.contentVersion); setProgress(reset); setCurrentId(firstLesson?.id ?? ''); }}>학습 기록 초기화</button></aside>
    <main className="lesson"><header className="lesson-header"><p className="eyebrow">{location.part.title} · {location.flatIndex + 1} / {flattenLessons(result.book).length}</p><h1>{location.lesson.title}</h1>{location.lesson.summary && <p className="lede">{location.lesson.summary}</p>}<ul className="objectives" aria-label="학습 목표">{location.lesson.objectives.map((objective) => <li key={objective.id}>{objective.title}</li>)}</ul></header>
      {progress?.lessons[currentId]?.status === 'completed' && <p className="completion" role="status">✓ 이 단원을 완료했습니다.</p>}<div className="blocks">{location.lesson.blocks.map((block) => <BlockRenderer key={block.id} block={block} onProgress={(kind, value) => record(block.id, kind, value)} />)}</div>
      <nav className="lesson-nav" aria-label="단원 이동"><button disabled={!navigation.previous} onClick={() => navigation.previous && setCurrentId(navigation.previous.id)}>← {navigation.previous?.title ?? '이전 단원'}</button><button disabled={!navigation.next} onClick={() => navigation.next && setCurrentId(navigation.next.id)}>{navigation.next?.title ?? '다음 단원'} →</button></nav></main>
  </div>;
}
