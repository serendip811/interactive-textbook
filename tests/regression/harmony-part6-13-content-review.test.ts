import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { pitchName, type Pitch } from '../../subjects/music/src';

type ViewerInput = {
  pairs?: Pitch[][];
  presentation?: 'chord' | 'sequence';
};

const reviewedParts = harmonyBook.parts.filter((part) => {
  const partNumber = Number(part.title.match(/^PART (\d+)\./)?.[1]);
  return partNumber >= 6 && partNumber <= 13;
});
const reviewedLessons = reviewedParts.flatMap((part) => part.lessons);
const activities = reviewedLessons.flatMap((lesson) => lesson.blocks
  .filter((block) => block.type === 'activity.subject')
  .map((block) => ({ lesson, block })));
const viewers = activities.filter(({ block }) => (block.data as { tool: string }).tool === 'pitch-pair-viewer');

function lessonByLegacyId(legacyId: string) {
  return reviewedLessons.find((lesson) => lesson.title.startsWith(`${legacyId}. `));
}

function viewerInput(legacyId: string): ViewerInput {
  const lesson = lessonByLegacyId(legacyId);
  const block = lesson?.blocks.find((candidate) => candidate.type === 'activity.subject');
  return (block?.data as { input: ViewerInput }).input;
}

describe('Harmony PART 6-13 content review', () => {
  it('covers all 36 lessons and 37 subject activities', () => {
    expect(reviewedLessons).toHaveLength(36);
    expect(activities).toHaveLength(37);
    expect(viewers).toHaveLength(35);
  });

  it('keeps every pitch viewer connected to its canonical pitch groups', () => {
    for (const { lesson, block } of viewers) {
      const input = (block.data as { input: ViewerInput }).input;
      const source = lesson.data?.find((entry) => entry.id === block.dataRefs?.[0]);
      expect(source?.kind, block.id).toBe('pitch-groups');
      expect(input.pairs, block.id).toEqual(source?.value);
    }
  });

  it('marks all six nonchord-tone examples as melodic sequences', () => {
    for (const legacyId of ['10-1', '10-2', '10-3', '10-4', '10-5', '10-6']) {
      expect(viewerInput(legacyId).presentation, legacyId).toBe('sequence');
    }
  });

  it('shows both natural-minor and harmonic-minor dominant resources', () => {
    const groups = viewerInput('6-2').pairs?.map((group) => group.map(pitchName).join('–'));
    expect(groups).toContain('E4–G4–B4');
    expect(groups).toContain('E4–G♯4–B4');
    expect(groups).toContain('G♯4–B4–D4');
  });

  it('spells the F-sharp-major dominant as C-sharp–E-sharp–G-sharp', () => {
    const groups = viewerInput('13-4').pairs?.map((group) => group.map(pitchName).join('–'));
    expect(groups?.[1]).toBe('C♯4–E♯4–G♯4');
  });
});
