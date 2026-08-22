import { useState } from 'react';
import type { Block } from '@interactive-textbook/schema';
import {
  evaluateMultipleChoice,
  type CalloutBlockData,
  type MarkdownBlockData,
  type MultipleChoiceBlockData,
  type SubjectActivityBlockData,
  type SummaryBlockData,
} from '@interactive-textbook/common-blocks';
import { MusicActivity } from './MusicActivity';

function MarkdownBlock({ data }: { data: MarkdownBlockData }) {
  return <div className="prose">{data.markdown.split('\n\n').map((text, index) => <p key={index}>{text}</p>)}</div>;
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
  const result = submitted ? evaluateMultipleChoice(data, selected) : undefined;
  return <form className="quiz" onSubmit={(event) => { event.preventDefault(); if (selected) { const evaluation = evaluateMultipleChoice(data, selected); const count = attempts + 1; setAttempts(count); setSubmitted(true); onSubmit?.({ response: selected, correct: evaluation.correct, attempts: count }); } }}>
    <fieldset><legend>{data.prompt}</legend>{data.options.map((option) => <label key={option.id} className="option"><input type="radio" name="answer" value={option.id} checked={selected === option.id} onChange={() => { setSelected(option.id); setSubmitted(false); }} />{option.label}</label>)}</fieldset>
    <button type="submit" disabled={!selected}>정답 확인</button>
    <p className={result?.correct ? 'feedback feedback--success' : 'feedback'} aria-live="polite">{result?.message}</p>
  </form>;
}
function SubjectActivityBlock({ data, onComplete }: { data: SubjectActivityBlockData; onComplete?: (result: unknown) => void }) {
  if (data.subject === 'music' && ['pitch-pair-viewer', 'semitone-explorer', 'interval-builder', 'chord-builder'].includes(data.tool)) return <MusicActivity tool={data.tool} title={data.title} input={data.input as never} onComplete={onComplete as never} />;
  return <section className="activity" aria-label={`${data.title} 활동`}><p className="section-label">{data.subject} · {data.tool}</p><h2>{data.title}</h2><p>과목 도구가 이 영역에 연결됩니다.</p></section>;
}
function UnsupportedBlock({ block }: { block: Block }) {
  return <section className="block-error" role="alert"><strong>표시할 수 없는 블록입니다.</strong><p><code>{block.type}</code> 형식은 현재 플레이어에서 지원하지 않습니다.</p></section>;
}
export function BlockRenderer({ block, onProgress }: { block: Block; onProgress?: (kind: 'visit' | 'activity' | 'assessment', result?: unknown) => void }) {
  const content = (() => {
  switch (block.type) {
    case 'content.markdown': return <MarkdownBlock data={block.data as MarkdownBlockData} />;
    case 'content.callout': return <CalloutBlock data={block.data as CalloutBlockData} />;
    case 'content.summary': return <SummaryBlock data={block.data as SummaryBlockData} />;
    case 'assessment.multiple-choice': return <MultipleChoiceBlock data={block.data as MultipleChoiceBlockData} onSubmit={(result) => onProgress?.('assessment', result)} />;
    case 'activity.subject': return <SubjectActivityBlock data={block.data as SubjectActivityBlockData} onComplete={(result) => onProgress?.('activity', result)} />;
    default: return <UnsupportedBlock block={block} />;
  }
  })();
  return <div className="block-slot" onFocusCapture={() => onProgress?.('visit')} onClickCapture={() => onProgress?.('visit')}>{content}</div>;
}
