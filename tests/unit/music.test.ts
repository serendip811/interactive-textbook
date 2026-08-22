import { describe, expect, it } from 'vitest';
import { createInterval, pitchName, pitchToMidi, type Pitch } from '../../subjects/music/src';
const p = (step: Pitch['step'], alter: Pitch['alter'], octave: number): Pitch => ({ step, alter, octave });
describe('music meaning model', () => {
  it('preserves enharmonic spelling while sharing MIDI identity', () => { const sharp = p('C', 1, 4); const flat = p('D', -1, 4); expect(pitchToMidi(sharp)).toBe(pitchToMidi(flat)); expect(pitchName(sharp)).toBe('C♯4'); expect(pitchName(flat)).toBe('D♭4'); });
  it('calculates simple and compound intervals', () => { expect(createInterval(p('C', 0, 4), p('E', -1, 4))).toMatchObject({ degree: 3, semitones: 3, quality: 'minor' }); expect(createInterval(p('C', 0, 4), p('E', 0, 5))).toMatchObject({ degree: 10, semitones: 16, quality: 'major' }); });
  it('supports descending intervals', () => { expect(createInterval(p('G', 0, 4), p('C', 0, 4))).toMatchObject({ degree: 5, semitones: 7, direction: 'descending', quality: 'perfect' }); });
  it('supports double accidentals within v0.1', () => { expect(pitchToMidi(p('F', 2, 4))).toBe(67); expect(pitchName(p('B', -2, 3))).toBe('B𝄫3'); });
});
