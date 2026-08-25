import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { harmonyBook } from '@interactive-textbook/book-harmony';
import { functionsBook } from '@interactive-textbook/book-functions';
import { findLesson, flattenLessons, getLessonNavigation, loadBook } from '@interactive-textbook/engine-player';
import { BlockRenderer } from './BlockRenderer';
import { clearBookProgress, emptyBookProgress, loadBookProgress, saveBookProgress, updateLessonProgress, type ActivityProgress, type BookProgress } from '@interactive-textbook/learning-state';


export function App() {
  const requestedBook = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('book') === 'functions' ? functionsBook : harmonyBook;
  const result = useMemo(() => { try { return { book: loadBook(requestedBook) }; } catch (error) { return { error: error instanceof Error ? error.message : '알 수 없는 오류' }; } }, [requestedBook]);
  const firstLesson = result.book ? flattenLessons(result.book)[0] : undefined;
  const initialProgress = useMemo(() => result.book && typeof localStorage !== 'undefined' ? loadBookProgress(localStorage, result.book.id, result.book.contentVersion) : result.book ? emptyBookProgress(result.book.id, result.book.contentVersion) : undefined, [result.book]);
  const [progress, setProgress] = useState<BookProgress | undefined>(initialProgress);
  const [currentId, setCurrentId] = useState(initialProgress?.currentLessonId ?? firstLesson?.id ?? '');
  const [tocOpen, setTocOpen] = useState(false);
  const [expandedPartId, setExpandedPartId] = useState(() => result.book ? findLesson(result.book, initialProgress?.currentLessonId ?? firstLesson?.id ?? '')?.part.id ?? null : null);
  const [confirmReset, setConfirmReset] = useState(false);
  const lessonHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousLessonId = useRef(currentId);
  useEffect(() => { const changed = previousLessonId.current !== currentId; previousLessonId.current = currentId; window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); if (changed) lessonHeadingRef.current?.focus({ preventScroll: true }); }, [currentId]);
  if (!result.book) return <main className="fatal" role="alert"><h1>교재를 열 수 없습니다.</h1><p>{result.error}</p></main>;
  const location = findLesson(result.book, currentId);
  if (!location) return <main className="fatal" role="alert"><h1>단원을 찾을 수 없습니다.</h1><button onClick={() => setCurrentId(firstLesson?.id ?? '')}>첫 단원으로 이동</button></main>;
  const navigation = getLessonNavigation(result.book, currentId);
  const record = (blockId: string, kind: 'visit' | 'activity' | 'assessment', value?: unknown) => setProgress((current) => {
    if (!current) return current; const prior = current.lessons[currentId]; const activity = value as { response?: unknown; pitches?: unknown; correct?: boolean; attempts?: number } | undefined; const item: ActivityProgress | undefined = activity ? { response: activity.response ?? activity.pitches, correct: Boolean(activity.correct), attempts: activity.attempts ?? 1, completed: Boolean(activity.correct), updatedAt: new Date().toISOString() } : undefined;
    const activities = kind === 'activity' && item ? { ...(prior?.activities ?? {}), [blockId]: item } : (prior?.activities ?? {}); const assessments = kind === 'assessment' && item ? { ...(prior?.assessments ?? {}), [blockId]: item } : (prior?.assessments ?? {}); const required = location.lesson.completion.type === 'required-blocks' ? location.lesson.completion.blockRefs : []; const completed = required.length > 0 && required.every((id) => activities[id]?.completed || assessments[id]?.completed); const next = updateLessonProgress(current, currentId, { status: completed ? 'completed' : 'started', lastBlockId: blockId, activities, assessments }); saveBookProgress(localStorage, next); return next;
  });
  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    lessonHeadingRef.current?.focus({ preventScroll: true });
    lessonHeadingRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  };
  const selectLesson = (lessonId: string) => {
    setCurrentId(lessonId);
    setExpandedPartId(findLesson(result.book, lessonId)?.part.id ?? null);
    setTocOpen(false);
  };
  return <><a className="skip-link" href="#main-content" onClick={skipToContent}>본문으로 건너뛰기</a><div className="app-shell">
    <button className="toc-toggle" type="button" aria-controls="book-toc" aria-expanded={tocOpen} onClick={() => { setTocOpen((open) => !open); setExpandedPartId(location.part.id); }}>{tocOpen ? '× 목차 닫기' : '☰ 목차 열기'}</button>
    <aside id="book-toc" className={`toc${tocOpen ? ' toc--open' : ''}`} aria-label="교재 목차"><div className="brand"><span>INTERACTIVE BOOK</span><strong>{result.book.title}</strong></div><nav className="book-switcher" aria-label="교재 선택"><a href="?book=harmony" aria-current={result.book.id === harmonyBook.id ? 'page' : undefined}>화성학</a><a href="?book=functions" aria-current={result.book.id === functionsBook.id ? 'page' : undefined}>함수와 그래프</a></nav>{confirmReset ? <div className="reset-confirm" role="group" aria-label="진도 초기화 확인"><p>현재 진도 기록을 지우고 첫 단원부터 시작할까요?</p><button className="reset-progress confirm" onClick={() => { clearBookProgress(localStorage, result.book.id); const reset = emptyBookProgress(result.book.id, result.book.contentVersion); setProgress(reset); selectLesson(firstLesson?.id ?? ''); setConfirmReset(false); }}>진도 기록 지우기</button><button onClick={() => setConfirmReset(false)}>취소</button></div> : <button className="reset-progress" onClick={() => setConfirmReset(true)}>진도 초기화</button>}{result.book.parts.map((part) => { const expanded = expandedPartId === part.id; return <section className="toc-part" key={part.id}><h2><button type="button" className="toc-part-toggle" aria-expanded={expanded} aria-controls={`${part.id}-lessons`} onClick={() => setExpandedPartId(expanded ? null : part.id)}>{part.title}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button></h2><ol id={`${part.id}-lessons`} hidden={!expanded}>{part.lessons.map((lesson) => <li key={lesson.id}><button className={lesson.id === currentId ? 'active' : ''} aria-current={lesson.id === currentId ? 'page' : undefined} onClick={() => selectLesson(lesson.id)}>{progress?.lessons[lesson.id]?.status === 'completed' ? '✓ ' : ''}{lesson.title}</button></li>)}</ol></section>; })}</aside>
    <main className="lesson" id="main-content"><header className="lesson-header"><p className="eyebrow">{location.part.title} · {location.flatIndex + 1} / {flattenLessons(result.book).length}</p><h1 ref={lessonHeadingRef} tabIndex={-1}>{location.lesson.title}</h1>{location.lesson.summary && <p className="lede">{location.lesson.summary}</p>}<ul className="objectives" aria-label="학습 목표">{location.lesson.objectives.map((objective) => <li key={objective.id}>{objective.title}</li>)}</ul></header>
      {progress?.lessons[currentId]?.status === 'completed' && <p className="completion" role="status">✓ 이 단원을 완료했습니다. 아래 활동은 언제든 다시 연습할 수 있습니다.</p>}<div className="blocks">{location.lesson.blocks.map((block) => <BlockRenderer key={block.id} block={block} referencedData={block.dataRefs?.map((id) => location.lesson.data?.find((item) => item.id === id)?.value)} onProgress={(kind, value) => record(block.id, kind, value)} />)}</div>
      <nav className="lesson-nav" aria-label="단원 이동"><button disabled={!navigation.previous} onClick={() => navigation.previous && setCurrentId(navigation.previous.id)}>← {navigation.previous?.title ?? '이전 단원'}</button><button disabled={!navigation.next} onClick={() => navigation.next && setCurrentId(navigation.next.id)}>{navigation.next?.title ?? '다음 단원'} →</button></nav></main>
  </div></>;
}
