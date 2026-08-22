import { useMemo, useState } from 'react';
import { harmonyBook } from '@interactive-textbook/book-harmony';
import { findLesson, flattenLessons, getLessonNavigation, loadBook } from '@interactive-textbook/engine-player';
import { BlockRenderer } from './BlockRenderer';

export function App() {
  const result = useMemo(() => { try { return { book: loadBook(harmonyBook) }; } catch (error) { return { error: error instanceof Error ? error.message : '알 수 없는 오류' }; } }, []);
  const firstLesson = result.book ? flattenLessons(result.book)[0] : undefined;
  const [currentId, setCurrentId] = useState(firstLesson?.id ?? '');
  if (!result.book) return <main className="fatal" role="alert"><h1>교재를 열 수 없습니다.</h1><p>{result.error}</p></main>;
  const location = findLesson(result.book, currentId);
  if (!location) return <main className="fatal" role="alert"><h1>단원을 찾을 수 없습니다.</h1><button onClick={() => setCurrentId(firstLesson?.id ?? '')}>첫 단원으로 이동</button></main>;
  const navigation = getLessonNavigation(result.book, currentId);
  return <div className="app-shell">
    <aside className="toc" aria-label="교재 목차"><div className="brand"><span>INTERACTIVE BOOK</span><strong>{result.book.title}</strong></div>{result.book.parts.map((part) => <section key={part.id}><h2>{part.title}</h2><ol>{part.lessons.map((lesson) => <li key={lesson.id}><button className={lesson.id === currentId ? 'active' : ''} aria-current={lesson.id === currentId ? 'page' : undefined} onClick={() => setCurrentId(lesson.id)}>{lesson.title}</button></li>)}</ol></section>)}</aside>
    <main className="lesson"><header className="lesson-header"><p className="eyebrow">{location.part.title} · {location.flatIndex + 1} / {flattenLessons(result.book).length}</p><h1>{location.lesson.title}</h1>{location.lesson.summary && <p className="lede">{location.lesson.summary}</p>}<ul className="objectives" aria-label="학습 목표">{location.lesson.objectives.map((objective) => <li key={objective.id}>{objective.title}</li>)}</ul></header>
      <div className="blocks">{location.lesson.blocks.map((block) => <BlockRenderer key={block.id} block={block} />)}</div>
      <nav className="lesson-nav" aria-label="단원 이동"><button disabled={!navigation.previous} onClick={() => navigation.previous && setCurrentId(navigation.previous.id)}>← {navigation.previous?.title ?? '이전 단원'}</button><button disabled={!navigation.next} onClick={() => navigation.next && setCurrentId(navigation.next.id)}>{navigation.next?.title ?? '다음 단원'} →</button></nav></main>
  </div>;
}
