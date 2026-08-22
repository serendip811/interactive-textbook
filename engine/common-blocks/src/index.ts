export const commonBlockKinds = [
  'content.markdown',
  'content.callout',
  'content.summary',
  'assessment.multiple-choice',
  'activity.subject',
] as const;

export type CommonBlockKind = (typeof commonBlockKinds)[number];
export interface MarkdownBlockData { markdown: string; }
export interface CalloutBlockData { title: string; body: string; tone?: 'note' | 'tip' | 'warning'; }
export interface SummaryBlockData { title?: string; items: string[]; }
export interface MultipleChoiceOption { id: string; label: string; }
export interface MultipleChoiceBlockData { prompt: string; options: MultipleChoiceOption[]; answer: string; explanation: string; }
export interface SubjectActivityBlockData { subject: string; tool: string; title: string; input: unknown; }
export interface MultipleChoiceEvaluation { correct: boolean; message: string; }
export function evaluateMultipleChoice(data: MultipleChoiceBlockData, selected: string): MultipleChoiceEvaluation {
  const correct = selected === data.answer;
  return { correct, message: correct ? `정답입니다. ${data.explanation}` : `다시 생각해 보세요. ${data.explanation}` };
}
export function isCommonBlockKind(value: string): value is CommonBlockKind {
  return (commonBlockKinds as readonly string[]).includes(value);
}
