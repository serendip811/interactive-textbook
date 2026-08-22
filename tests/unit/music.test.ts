import { describe, expect, it } from 'vitest';
import { classifyToneDistance, createInterval, keyboardGeometry, pitchName, pitchToMidi, validatePitchPair, type Pitch } from '../../subjects/music/src';
const p = (step: Pitch['step'], alter: Pitch['alter'], octave: number): Pitch => ({ step, alter, octave });
describe('music meaning model', () => {
  it('preserves enharmonic spelling while sharing MIDI identity', () => { const sharp = p('C', 1, 4); const flat = p('D', -1, 4); expect(pitchToMidi(sharp)).toBe(pitchToMidi(flat)); expect(pitchName(sharp)).toBe('C♯4'); expect(pitchName(flat)).toBe('D♭4'); });
  it('calculates simple and compound intervals', () => { expect(createInterval(p('C', 0, 4), p('E', -1, 4))).toMatchObject({ degree: 3, semitones: 3, quality: 'minor' }); expect(createInterval(p('C', 0, 4), p('E', 0, 5))).toMatchObject({ degree: 10, semitones: 16, quality: 'major' }); });
  it('supports descending intervals', () => { expect(createInterval(p('G', 0, 4), p('C', 0, 4))).toMatchObject({ degree: 5, semitones: 7, direction: 'descending', quality: 'perfect' }); });
  it('supports double accidentals within v0.1', () => { expect(pitchToMidi(p('F', 2, 4))).toBe(67); expect(pitchName(p('B', -2, 3))).toBe('B𝄫3'); });
});
describe('semitone activity helpers', () => {
  it('classifies semitones and whole tones', () => { expect(classifyToneDistance(p('E', 0, 4), p('F', 0, 4))).toBe('semitone'); expect(classifyToneDistance(p('C', 0, 4), p('D', 0, 4))).toBe('whole-tone'); });
  it('keeps black-key geometry separate from white-key flow', () => { expect(keyboardGeometry(60, 64).map(({ black, whiteIndex }) => [black, whiteIndex])).toEqual([[false, 0], [true, 0], [false, 1], [true, 1], [false, 2]]); });
  it('handles keyboard boundaries and accidental spellings', () => { expect(keyboardGeometry(60, 72)).toHaveLength(13); expect(validatePitchPair(p('C', 0, 4), p('D', -1, 4))).toMatchObject({ correct: true, semitones: 1, kind: 'semitone' }); expect(validatePitchPair(p('B', 0, 4), p('C', 0, 5))).toMatchObject({ semitones: 1 }); });
});
