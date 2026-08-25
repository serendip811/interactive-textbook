import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { pitchName, type Pitch } from '../../subjects/music/src';

type ViewerInput = {
  pairs?: Pitch[][];
  playbackMode?: 'sequential' | 'simultaneous';
};

const partIds = [
  'harmony.part.diatonic',
  'harmony.part.functions',
  'harmony.part.cadences',
  'harmony.part.progressions',
  'harmony.part.nonchord-tones',
  'harmony.part.applied-chords',
  'harmony.part.chromatic-harmony',
  'harmony.part.modulation',
];
const reviewedParts = harmonyBook.parts.filter((part) => partIds.includes(part.id));
const reviewedLessons = reviewedParts.flatMap((part) => part.lessons);
const lessonById = (id: string) => reviewedLessons.find((lesson) => lesson.id === id);
const pitchGroups = (id: string) => lessonById(id)?.data?.[0].value as Pitch[][];
const pitchNames = (groups: Pitch[][]) => groups.map((group) => group.map(pitchName));

describe('Harmony PART 6-13 content review', () => {
  it('covers all 36 lessons and 37 subject activities', () => {
    expect(reviewedLessons).toHaveLength(36);
    expect(reviewedLessons.flatMap((lesson) => lesson.blocks.filter((block) => block.type === 'activity.subject'))).toHaveLength(37);
  });

  it('keeps viewer pitch groups identical to canonical lesson data', () => {
    for (const lesson of reviewedLessons) {
      for (const block of lesson.blocks) {
        if (block.type !== 'activity.subject') continue;
        const input = (block.data as { input: ViewerInput }).input;
        if (!input.pairs || !block.dataRefs?.length) continue;
        const source = lesson.data?.find((entry) => entry.id === block.dataRefs?.[0]);
        expect(input.pairs, block.id).toEqual(source?.value);
      }
    }
  });

  it('compares the natural- and harmonic-minor dominant families explicitly', () => {
    expect(pitchNames(pitchGroups('harmony.lesson.minor-diatonic.lesson'))).toEqual([
      ['E4', 'G4', 'B4'],
      ['E4', 'G♯4', 'B4'],
      ['G3', 'B3', 'D4'],
      ['G♯3', 'B3', 'D4'],
      ['A3', 'C4', 'E4'],
    ]);
  });

  it('marks every PART 10 nonchord-tone example as a sequential melody', () => {
    const part = reviewedParts.find((item) => item.id === 'harmony.part.nonchord-tones');
    expect(part?.lessons).toHaveLength(6);
    for (const lesson of part?.lessons ?? []) {
      const activity = lesson.blocks.find((block) => block.type === 'activity.subject');
      expect((activity?.data as { input: ViewerInput }).input.playbackMode, lesson.id).toBe('sequential');
    }
  });

  it('preserves the reviewed nonchord-tone contours', () => {
    expect(pitchNames(pitchGroups('harmony.lesson.appoggiatura.lesson'))).toEqual([
      ['E4', 'D4', 'D4'],
      ['B4', 'C5', 'C5'],
    ]);
    expect(pitchNames(pitchGroups('harmony.lesson.escape-tone.lesson'))).toEqual([
      ['C4', 'D4', 'A3'],
      ['E4', 'F4', 'C4'],
    ]);
    expect(pitchNames(pitchGroups('harmony.lesson.cambiata.lesson'))).toEqual([
      ['E4', 'D4', 'B3', 'C4'],
      ['C5', 'B4', 'G4', 'A4'],
    ]);
  });

  it('spells the new-key dominant with E-sharp in the direct modulation', () => {
    expect(pitchNames(pitchGroups('harmony.lesson.direct-modulation.lesson'))).toEqual([
      ['C4', 'E4', 'G4'],
      ['C♯4', 'E♯4', 'G♯4'],
      ['F♯4', 'A♯4', 'C♯5'],
    ]);
  });

  it('shows both augmented-sixth tendency tones resolving to G', () => {
    expect(pitchNames(pitchGroups('harmony.lesson.augmented-sixth.lesson'))).toEqual([
      ['A♭4', 'C5', 'F♯5'],
      ['G4', 'B4', 'D5', 'G5'],
    ]);
  });
});
