import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { createPitchPlaybackFrames } from '../../apps/player/src/musicAudio';
import { pitchToMidi, type Pitch } from '../../subjects/music/src';

type ActivityInput = {
  pairs?: Pitch[][];
  initial?: Pitch[];
  targetPitches?: Pitch[];
  range?: { fromMidi: number; toMidi: number };
};

const reviewedParts = harmonyBook.parts.filter((part) => /^PART [0-5]\./.test(part.title));
const reviewedLessons = reviewedParts.flatMap((part) => part.lessons);
const activities = reviewedLessons.flatMap((lesson) => lesson.blocks
  .filter((block) => block.type === 'activity.subject')
  .map((block) => ({ lesson, block })));

describe('Harmony PART 0-5 media consistency', () => {
  it('covers all 25 reviewed lessons and 28 subject activities', () => {
    expect(reviewedLessons).toHaveLength(25);
    expect(activities).toHaveLength(28);
  });

  it('keeps viewer input groups identical to their canonical lesson data', () => {
    for (const { lesson, block } of activities) {
      const input = (block.data as { input: ActivityInput }).input;
      if (!input.pairs || !block.dataRefs?.length) continue;
      const source = lesson.data?.find((entry) => entry.id === block.dataRefs?.[0]);
      expect(source, block.id).toBeDefined();
      const canonicalGroups = source?.kind === 'chords'
        ? (source.value as Array<{ pitches: Pitch[] }>).map((chord) => chord.pitches)
        : source?.value;
      expect(input.pairs, block.id).toEqual(canonicalGroups);
    }
  });

  it('keeps every initially visible or target pitch inside explicit keyboard ranges', () => {
    for (const { block } of activities) {
      const input = (block.data as { input: ActivityInput }).input;
      if (!input.range) continue;
      const pitches = [...(input.initial ?? []), ...(input.targetPitches ?? []), ...(input.pairs?.flat() ?? [])];
      for (const pitch of pitches) {
        const midi = pitchToMidi(pitch);
        expect(midi, `${block.id}: ${pitch.step}${pitch.octave}`).toBeGreaterThanOrEqual(input.range.fromMidi);
        expect(midi, `${block.id}: ${pitch.step}${pitch.octave}`).toBeLessThanOrEqual(input.range.toMidi);
      }
    }
  });

  it('plays intervals sequentially and chords simultaneously', () => {
    const pitches: Pitch[] = [
      { step: 'C', alter: 0, octave: 4 },
      { step: 'E', alter: 0, octave: 4 },
      { step: 'G', alter: 0, octave: 4 },
    ];
    expect(createPitchPlaybackFrames(pitches, false)).toEqual([[pitches[0]], [pitches[1]], [pitches[2]]]);
    expect(createPitchPlaybackFrames(pitches, true)).toEqual([pitches]);
  });
});
