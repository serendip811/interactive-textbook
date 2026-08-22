import { describe, expect, it } from 'vitest';
import { evaluateMultipleChoice, isCommonBlockKind } from '../../engine/common-blocks/src/index';

const question = { prompt: '반음 두 개는?', options: [{ id: 'tone', label: '온음' }], answer: 'tone', explanation: '반음 두 개가 온음입니다.' };
describe('common blocks', () => {
  it('evaluates multiple-choice answers with feedback', () => {
    expect(evaluateMultipleChoice(question, 'tone')).toEqual({ correct: true, message: '정답입니다. 반음 두 개가 온음입니다.' });
  });
  it('recognizes subject activity blocks', () => { expect(isCommonBlockKind('activity.subject')).toBe(true); });
});
