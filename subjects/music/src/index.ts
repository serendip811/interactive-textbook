export const musicSubjectId = 'music' as const;

export type Step = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Alter = -2 | -1 | 0 | 1 | 2;
export interface Pitch { step: Step; alter: Alter; octave: number; }
export type Duration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';
export interface NoteEvent { id: string; pitch: Pitch; duration: Duration; offsetBeats: number; durationBeats: number; }
export type IntervalDirection = 'ascending' | 'descending' | 'unison';
export type IntervalQuality = 'perfect' | 'major' | 'minor' | 'augmented' | 'diminished';
export interface Interval { from: Pitch; to: Pitch; degree: number; semitones: number; direction: IntervalDirection; quality: IntervalQuality; }
export interface Chord { id: string; root: Pitch; pitches: Pitch[]; bass: Pitch; symbol?: string; }
export interface ProgressionStep { chord: Chord; startsAtMs: number; durationMs: number; }
export interface Progression { id: string; mode: 'sequential'; steps: ProgressionStep[]; }

const stepIndex: Record<Step, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const naturalSemitone: Record<Step, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const expectedSemitones = [0, 2, 4, 5, 7, 9, 11] as const;

export function pitchToMidi(pitch: Pitch): number { return (pitch.octave + 1) * 12 + naturalSemitone[pitch.step] + pitch.alter; }
export function pitchName(pitch: Pitch): string { const accidental = pitch.alter === -2 ? '𝄫' : pitch.alter === -1 ? '♭' : pitch.alter === 1 ? '♯' : pitch.alter === 2 ? '𝄪' : ''; return `${pitch.step}${accidental}${pitch.octave}`; }
export function intervalDegree(from: Pitch, to: Pitch): number { return Math.abs((to.octave * 7 + stepIndex[to.step]) - (from.octave * 7 + stepIndex[from.step])) + 1; }
export function intervalSemitones(from: Pitch, to: Pitch): number { return Math.abs(pitchToMidi(to) - pitchToMidi(from)); }
export function intervalDirection(from: Pitch, to: Pitch): IntervalDirection { const diff = pitchToMidi(to) - pitchToMidi(from); return diff === 0 ? 'unison' : diff > 0 ? 'ascending' : 'descending'; }
export function intervalQuality(degree: number, semitones: number): IntervalQuality {
  const simple = ((degree - 1) % 7) + 1;
  const octaves = Math.floor((degree - 1) / 7);
  const delta = semitones - (octaves * 12 + expectedSemitones[simple - 1]);
  if ([1, 4, 5].includes(simple)) return delta === 0 ? 'perfect' : delta > 0 ? 'augmented' : 'diminished';
  return delta === 0 ? 'major' : delta === -1 ? 'minor' : delta > 0 ? 'augmented' : 'diminished';
}
export function createInterval(from: Pitch, to: Pitch): Interval { const degree = intervalDegree(from, to); const semitones = intervalSemitones(from, to); return { from, to, degree, semitones, direction: intervalDirection(from, to), quality: intervalQuality(degree, semitones) }; }
