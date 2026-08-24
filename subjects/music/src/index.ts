export const musicSubjectId = 'music' as const;

export type Step = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Alter = -2 | -1 | 0 | 1 | 2;
export interface Pitch { step: Step; alter: Alter; octave: number; }
export function validatePitchData(pitch: Pitch): string[] {
  const issues: string[] = [];
  if (!['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(pitch.step)) issues.push(`지원하지 않는 음이름입니다: ${pitch.step}`);
  if (![-2, -1, 0, 1, 2].includes(pitch.alter)) issues.push(`지원하지 않는 변화표 값입니다: ${pitch.alter}`);
  if (!Number.isInteger(pitch.octave) || pitch.octave < -1 || pitch.octave > 9) issues.push(`옥타브 범위를 확인하세요: ${pitch.octave}`);
  return issues;
}
export type Duration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';
export interface NoteEvent { id: string; pitch: Pitch; duration: Duration; offsetBeats: number; durationBeats: number; }
export type IntervalDirection = 'ascending' | 'descending' | 'unison';
export type IntervalQuality = 'perfect' | 'major' | 'minor' | 'augmented' | 'diminished';
export interface Interval { from: Pitch; to: Pitch; degree: number; semitones: number; direction: IntervalDirection; quality: IntervalQuality; }
export interface Chord { id: string; root: Pitch; pitches: Pitch[]; bass: Pitch; symbol?: string; }
export function validateChordData(chord: Chord): string[] {
  const issues = [...validatePitchData(chord.root), ...validatePitchData(chord.bass), ...chord.pitches.flatMap(validatePitchData)];
  if (!chord.pitches.some((pitch) => pitchToMidi(pitch) === pitchToMidi(chord.root))) issues.push('화음 구성음에 근음이 없습니다.');
  if (!chord.pitches.some((pitch) => pitchToMidi(pitch) === pitchToMidi(chord.bass))) issues.push('화음 구성음에 베이스가 없습니다.');
  return issues;
}
export type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'unknown';
export interface ProgressionStep { chord: Chord; startsAtMs: number; durationMs: number; }
export interface Progression { id: string; mode: 'sequential'; steps: ProgressionStep[]; }
export type CadenceType = 'authentic' | 'half' | 'plagal' | 'deceptive';
export interface CadenceProgression extends Progression { cadenceType: CadenceType; }
export function cadenceFeedback(expected: CadenceType, selected: CadenceType): { correct: boolean; message: string } {
  const names: Record<CadenceType, string> = { authentic: '정격종지', half: '반종지', plagal: '변격종지', deceptive: '기만종지' }; const correct = expected === selected;
  return { correct, message: correct ? `정답입니다. 마지막이 ${names[expected]}의 기능 관계로 들립니다.` : `선택한 것은 ${names[selected]}입니다. 마지막 두 화음의 베이스와 해결감을 다시 들어보세요.` };
}
export interface VoiceLine { id: string; name: string; pitches: [Pitch, Pitch]; }
export interface VoiceLeading { id: string; voices: VoiceLine[]; }
export interface VoiceLeadingIssue { type: 'parallel-fifth' | 'parallel-octave'; voiceIds: [string, string]; fromIndex: 0; toIndex: 1; }
export interface HarmonicAnalysisInterpretation { id: string; romanNumeral: string; function: string; cadence?: string; explanation: string; }
export interface HarmonicAnalysisTask { id: string; context: string; accepted: HarmonicAnalysisInterpretation[]; expertNote?: string; }
export interface HarmonicAnalysisResponse { romanNumeral?: string; function?: string; cadence?: string; }
export interface HarmonicAnalysisResult { status: 'correct' | 'partial' | 'incorrect'; score: number; matchedInterpretationIds: string[]; message: string; }
export function validateHarmonicAnalysis(task: HarmonicAnalysisTask, response: HarmonicAnalysisResponse): HarmonicAnalysisResult {
  const required = ['romanNumeral', 'function'] as const;
  const fields = (['romanNumeral', 'function', 'cadence'] as const).filter((field) => response[field] !== undefined);
  const scored = task.accepted.map((answer) => ({ answer, matches: fields.filter((field) => response[field] === answer[field]).length }));
  const exact = scored.filter(({ answer }) => required.every((field) => response[field] !== undefined && response[field] === answer[field]) && (response.cadence === undefined || response.cadence === answer.cadence));
  if (exact.length) return { status: 'correct', score: 1, matchedInterpretationIds: exact.map(({ answer }) => answer.id), message: exact.length > 1 ? '정답입니다. 문맥상 가능한 복수 해석에 포함됩니다.' : '정답입니다. 문맥과 기능이 일치합니다.' };
  const best = Math.max(0, ...scored.map(({ matches }) => matches));
  if (best > 0) return { status: 'partial', score: best / Math.max(required.length, fields.length), matchedInterpretationIds: scored.filter(({ matches }) => matches === best).map(({ answer }) => answer.id), message: '일부 분석은 맞습니다. 로마숫자와 기능을 문맥에서 함께 확인하세요.' };
  return { status: 'incorrect', score: 0, matchedInterpretationIds: [], message: '선언된 대안 분석과 일치하지 않습니다. 전문가 해설과 문맥을 확인하세요.' };
}
export function analyzeVoiceLeading(value: VoiceLeading): VoiceLeadingIssue[] {
  const issues: VoiceLeadingIssue[] = [];
  for (let a = 0; a < value.voices.length; a += 1) for (let b = a + 1; b < value.voices.length; b += 1) { const first = value.voices[a]; const second = value.voices[b]; const start = Math.abs(pitchToMidi(first.pitches[0]) - pitchToMidi(second.pitches[0])) % 12; const end = Math.abs(pitchToMidi(first.pitches[1]) - pitchToMidi(second.pitches[1])) % 12; const moveA = Math.sign(pitchToMidi(first.pitches[1]) - pitchToMidi(first.pitches[0])); const moveB = Math.sign(pitchToMidi(second.pitches[1]) - pitchToMidi(second.pitches[0])); if (moveA !== 0 && moveA === moveB && start === end && (start === 7 || start === 0)) issues.push({ type: start === 7 ? 'parallel-fifth' : 'parallel-octave', voiceIds: [first.id, second.id], fromIndex: 0, toIndex: 1 }); }
  return issues;
}

const stepIndex: Record<Step, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const naturalSemitone: Record<Step, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const expectedSemitones = [0, 2, 4, 5, 7, 9, 11] as const;

export function pitchToMidi(pitch: Pitch): number { return (pitch.octave + 1) * 12 + naturalSemitone[pitch.step] + pitch.alter; }
export function validatePitchMidiPair(pitch: Pitch, midi: number): string[] { return pitchToMidi(pitch) === midi ? [] : [`음악 표기 ${pitchName(pitch)}와 MIDI ${midi}가 일치하지 않습니다.`]; }
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
