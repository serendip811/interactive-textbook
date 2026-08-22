export const commonBlockKinds = [
  'content.markdown',
  'content.callout',
  'content.summary',
  'assessment.multiple-choice',
] as const;

export type CommonBlockKind = (typeof commonBlockKinds)[number];
