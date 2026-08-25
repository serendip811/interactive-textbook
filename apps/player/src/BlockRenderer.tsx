import { Fragment, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { Block } from '@interactive-textbook/schema';
import {
  evaluateMultipleChoice,
  type CalloutBlockData,
  type MarkdownBlockData,
  type MultipleChoiceBlockData,
  type SubjectActivityBlockData,
  type SummaryBlockData,
} from '@interactive-textbook/common-blocks';
import { resolveSubjectActivity } from './subjectActivityRegistry';

function renderInlineMarkdown(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}
function MarkdownBlock({ data }: { data: MarkdownBlockData }) {
  return <div className="prose">{data.markdown.split('\n\n').map((text, index) => <p key={index}>{renderInlineMarkdown(text)}</p>)}</div>;
}
function CalloutBlock({ data }: { data: CalloutBlockData }) {
  return <aside className={`callout callout--${data.tone ?? 'note'}`} aria-label={data.title}><strong>{data.title}</strong><p>{data.body}</p></aside>;
}
function SummaryBlock({ data }: { data: SummaryBlockData }) {
  return <section className="summary" aria-labelledby="summary-title"><h2 id="summary-title">{data.title ?? '핵심 정리'}</h2><ul>{data.items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}
function MultipleChoiceBlock({ data, onSubmit }: { data: MultipleChoiceBlockData; onSubmit?: (result: { response: string; correct: boolean; attempts: number }) => void }) {
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const result = submitted ? evaluateMultipleChoice(data, selected) : undefined;
  const choose = (id: string) => { setSelected(id); setSubmitted(false); };
  const moveTo = (index: number) => {
    const next = (index + data.options.length) % data.options.length;
    choose(data.options[next].id);
    optionRefs.current[next]?.focus();
  };
  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveTo(index + 1); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveTo(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); moveTo(0); }
    if (event.key === 'End') { event.preventDefault(); moveTo(data.options.length - 1); }
  };
  return <form className="quiz" onSubmit={(event) => { event.preventDefault(); if (selected) { const evaluation = evaluateMultipleChoice(data, selected); const count = attempts + 1; setAttempts(count); setSubmitted(true); onSubmit?.({ response: selected, correct: evaluation.correct, attempts: count }); } }}>
    <fieldset><legend>{data.prompt}</legend><div className="options" role="radiogroup" aria-label={data.prompt}>{data.options.map((option, index) => <button key={option.id} ref={(element) => { optionRefs.current[index] = element; }} type="button" role="radio" aria-checked={selected === option.id} tabIndex={selected ? (selected === option.id ? 0 : -1) : (index === 0 ? 0 : -1)} className={`option ${selected === option.id ? 'option--selected' : ''}`} onKeyDown={(event) => handleOptionKeyDown(event, index)} onClick={() => choose(option.id)}><span className="radio-indicator" aria-hidden="true" />{option.label}</button>)}</div></fieldset>
    <button type="submit" disabled={!selected}>정답 확인</button>
    <p className={result?.correct ? 'feedback feedback--success' : 'feedback'} aria-live="polite">{result?.message}</p>
  </form>;
}
function SubjectActivityBlock({ data, referencedData, onComplete }: { data: SubjectActivityBlockData; referencedData?: unknown[]; onComplete?: (result: unknown) => void }) {
  const Renderer = resolveSubjectActivity(data.subject, data.tool);
  if (Renderer) return <Renderer data={data} referencedData={referencedData} onComplete={onComplete} />;
  return <section className="activity" aria-label={`${data.title} 활동`}><p className="section-label">{data.subject} · {data.tool}</p><h2>{data.title}</h2><p>과목 도구가 이 영역에 연결됩니다.</p></section>;
}
function UnsupportedBlock({ block }: { block: Block }) {
  return <section className="block-error" role="alert"><strong>표시할 수 없는 블록입니다.</strong><p><code>{block.type}</code> 형식은 현재 플레이어에서 지원하지 않습니다.</p></section>;
}
export function BlockRenderer({ block, referencedData, onProgress }: { block: Block; referencedData?: unknown[]; onProgress?: (kind: 'visit' | 'activity' | 'assessment', result?: unknown) => void }) {
  const onProgressRef = useRef(onProgress);
  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);
  useEffect(() => { onProgressRef.current?.('visit'); }, [block.id]);
  const content = (() => {
  switch (block.type) {
    case 'content.markdown': return <MarkdownBlock data={block.data as MarkdownBlockData} />;
    case 'content.callout': return <CalloutBlock data={block.data as CalloutBlockData} />;
    case 'content.summary': return <SummaryBlock data={block.data as SummaryBlockData} />;
    case 'assessment.multiple-choice': return <MultipleChoiceBlock data={block.data as MultipleChoiceBlockData} onSubmit={(result) => onProgress?.('assessment', result)} />;
    case 'activity.subject': return <SubjectActivityBlock data={block.data as SubjectActivityBlockData} referencedData={referencedData} onComplete={(result) => onProgress?.('activity', result)} />;
    default: return <UnsupportedBlock block={block} />;
  }
  })();
  return <div className="block-slot">{content}</div>;
}
