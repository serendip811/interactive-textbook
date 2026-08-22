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
export type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'unknown';
export interface ProgressionStep { chord: Chord; startsAtMs: number; durationMs: number; }
export interface Progression { id: string; mode: 'sequential'; steps: ProgressionStep[]; }
export type CadenceType = 'authentic' | 'half' | 'plagal' | 'deceptive';
export interface CadenceProgression extends Progression { cadenceType: CadenceType; }
export function cadenceFeedback(expected: CadenceType, selected: CadenceType): { correct: boolean; message: string } {
  const names: Record<CadenceType, string> = { authentic: '정격종지', half: '반종지', plagal: '변격종지', deceptive: '기만종지' }; const correct = expected === selected;
  return { correct, message: correct ? `정답입니다. 마지막이 ${names[expected]}의 기능 관계로 들립니다.` : `선택한 것은 ${names[selected]}입니다. 마지막 두 화음의 베이스와 해결감을 다시 들어보세요.` };
}

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
export type ToneDistance = 'unison' | 'semitone' | 'whole-tone' | 'larger';
export function classifyToneDistance(from: Pitch, to: Pitch): ToneDistance { const distance = intervalSemitones(from, to); return distance === 0 ? 'unison' : distance === 1 ? 'semitone' : distance === 2 ? 'whole-tone' : 'larger'; }
const sharpSpellings: Array<{ step: Step; alter: Alter }> = [{ step: 'C', alter: 0 }, { step: 'C', alter: 1 }, { step: 'D', alter: 0 }, { step: 'D', alter: 1 }, { step: 'E', alter: 0 }, { step: 'F', alter: 0 }, { step: 'F', alter: 1 }, { step: 'G', alter: 0 }, { step: 'G', alter: 1 }, { step: 'A', alter: 0 }, { step: 'A', alter: 1 }, { step: 'B', alter: 0 }];
export function midiToPitch(midi: number): Pitch { const normalized = ((midi % 12) + 12) % 12; return { ...sharpSpellings[normalized], octave: Math.floor(midi / 12) - 1 }; }
export interface PianoKeyGeometry { midi: number; pitch: Pitch; black: boolean; whiteIndex: number; }
export function keyboardGeometry(fromMidi: number, toMidi: number): PianoKeyGeometry[] { let whiteIndex = 0; return Array.from({ length: toMidi - fromMidi + 1 }, (_, index) => { const midi = fromMidi + index; const pitch = midiToPitch(midi); const black = pitch.alter !== 0; const key = { midi, pitch, black, whiteIndex: black ? whiteIndex - 1 : whiteIndex }; if (!black) whiteIndex += 1; return key; }); }
export interface PitchPairValidation { correct: boolean; semitones: number; kind: ToneDistance; message: string; }
export function validatePitchPair(from: Pitch, to: Pitch, accepted: ToneDistance[] = ['semitone', 'whole-tone']): PitchPairValidation {
  const semitones = intervalSemitones(from, to); const kind = classifyToneDistance(from, to); const correct = accepted.includes(kind);
  const label = kind === 'semitone' ? '반음' : kind === 'whole-tone' ? '온음' : kind === 'unison' ? '같은 음' : `${semitones}반음 거리`;
  return { correct, semitones, kind, message: correct ? `${semitones}반음: ${label}입니다.` : `두 음 사이는 ${semitones}반음입니다. 반음 또는 온음이 되는 두 음을 골라보세요.` };
}
export function triadQuality(chord: Pick<Chord, 'root' | 'pitches'>): TriadQuality {
  const root = pitchToMidi(chord.root); const intervals = [...new Set(chord.pitches.map((pitch) => ((pitchToMidi(pitch) - root) % 12 + 12) % 12))].sort((a, b) => a - b).join(',');
  return intervals === '0,4,7' ? 'major' : intervals === '0,3,7' ? 'minor' : intervals === '0,3,6' ? 'diminished' : intervals === '0,4,8' ? 'augmented' : 'unknown';
}
export interface ChordSelectionResult { correct: boolean; missing: Pitch[]; extra: Pitch[]; message: string; }
export function validateChordSelection(target: Pitch[], selected: Pitch[]): ChordSelectionResult {
  const targetMidi = new Set(target.map(pitchToMidi)); const selectedMidi = new Set(selected.map(pitchToMidi)); const missing = target.filter((pitch) => !selectedMidi.has(pitchToMidi(pitch))); const extra = selected.filter((pitch) => !targetMidi.has(pitchToMidi(pitch))); const correct = missing.length === 0 && extra.length === 0 && selectedMidi.size === targetMidi.size;
  const details = [missing.length ? `빠진 음: ${missing.map(pitchName).join(', ')}` : '', extra.length ? `잘못 선택한 음: ${extra.map(pitchName).join(', ')}` : ''].filter(Boolean).join(' · ');
  return { correct, missing, extra, message: correct ? '정답입니다. 세 구성음이 모두 맞습니다.' : details || '세 음을 선택하세요.' };
}
