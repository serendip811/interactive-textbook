import { describe, expect, it } from 'vitest';
import { validateHarmonicAnalysis, type HarmonicAnalysisTask } from '../../subjects/music/src';

const task: HarmonicAnalysisTask = {
  id: 'harmony.analysis.14-4.applied-dominant',
  context: 'C장조에서 D7이 G로 진행하며 뒤이어 C로 해결된다.',
  accepted: [
    { id: 'secondary-dominant', romanNumeral: 'V7/V', function: 'applied-dominant', cadence: 'tonicization', explanation: 'G를 잠시 으뜸처럼 강조한다.' },
    { id: 'chromatic-predominant', romanNumeral: 'II7#3', function: 'chromatic-predominant', cadence: 'expanded-dominant', explanation: '더 넓은 구절에서는 반음계적 프리도미넌트로 설명할 수 있다.' },
  ],
  expertNote: '자동 판정은 선언된 두 해석만 다루며, 실제 악곡의 성부·박절·구절 경계는 전문가가 검토한다.',
};

describe('harmonic analysis stress contract', () => {
  it('accepts more than one contextually declared answer', () => {
    expect(validateHarmonicAnalysis(task, { romanNumeral: 'V7/V', function: 'applied-dominant' }).status).toBe('correct');
    expect(validateHarmonicAnalysis(task, { romanNumeral: 'II7#3', function: 'chromatic-predominant' }).status).toBe('correct');
  });
  it('returns diagnostic partial credit without completing the activity', () => {
    const result = validateHarmonicAnalysis(task, { romanNumeral: 'V7/V', function: 'tonic' });
    expect(result.status).toBe('partial');
    expect(result.score).toBe(0.5);
  });
  it('rejects undeclared interpretations and preserves the expert-review boundary', () => {
    expect(validateHarmonicAnalysis(task, { romanNumeral: 'iv', function: 'subdominant' }).status).toBe('incorrect');
    expect(task.expertNote).toContain('전문가');
  });
});
