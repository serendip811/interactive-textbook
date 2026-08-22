import { describe, expect, it } from 'vitest';
import { analyzeVoiceLeading, type Pitch, type VoiceLeading } from '../../subjects/music/src';
const p = (step: Pitch['step'], octave: number): Pitch => ({ step, alter: 0, octave });
describe('voice-leading rules', () => {
  it('finds parallel octaves', () => { const value: VoiceLeading = { id: 'octaves', voices: [{ id: 's', name: 'S', pitches: [p('C', 5), p('D', 5)] }, { id: 'b', name: 'B', pitches: [p('C', 4), p('D', 4)] }] }; expect(analyzeVoiceLeading(value)[0].type).toBe('parallel-octave'); });
  it('finds parallel fifths and accepts contrary motion', () => { const fifths: VoiceLeading = { id: 'fifths', voices: [{ id: 's', name: 'S', pitches: [p('G', 4), p('A', 4)] }, { id: 'b', name: 'B', pitches: [p('C', 4), p('D', 4)] }] }; expect(analyzeVoiceLeading(fifths)[0].type).toBe('parallel-fifth'); const fixed = { ...fifths, voices: [{ ...fifths.voices[0], pitches: [p('G', 4), p('F', 4)] as [Pitch, Pitch] }, fifths.voices[1]] }; expect(analyzeVoiceLeading(fixed)).toEqual([]); });
});
