import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { triadQuality, type Chord } from '../../subjects/music/src';
const lesson = harmonyBook.parts[0].lessons.find((item) => item.id === 'harmony.lesson.triad');
describe('triad representative lesson', () => {
  it('keeps semantic Chord examples', () => { const chords = lesson?.data?.[0].value as Chord[]; expect(chords.map(triadQuality)).toEqual(['major', 'minor']); expect(chords[0].bass).toEqual(chords[0].root); });
  it('uses transfer examples instead of exposing the C-major answer', () => { const chords = lesson?.data?.[0].value as Chord[]; expect(chords.map((chord) => chord.root.step)).toEqual(['F', 'F']); });
  it('offers a reusable chord-building activity', () => { expect(lesson?.blocks.some((block) => block.type === 'activity.subject' && (block.data as { tool: string }).tool === 'chord-builder')).toBe(true); });
});
