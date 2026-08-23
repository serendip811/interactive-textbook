import { useState } from 'react';
import { analyzeVoiceLeading, pitchName, pitchToMidi, type Pitch, type VoiceLeading } from '@interactive-textbook/subject-music';
import { Keyboard, Staff } from './MusicActivity';
export function VoiceLeadingActivity({ title, input, onComplete }: { title: string; input: { value: VoiceLeading; targetPitch?: Pitch; instruction?: string }; onComplete?: (value: unknown) => void }) {
  const [value, setValue] = useState(input.value);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('현재 병행8도입니다. 목표에 맞는 소프라노 도착음을 선택하세요.');
  const issues = analyzeVoiceLeading(value);
  const upper = value.voices[0];
  const lower = value.voices[1];
  const targetPitch = input.targetPitch ?? { step: 'B', alter: 0, octave: 4 };
  const choose = (pitch: Pitch) => {
    const next = { ...value, voices: [{ ...upper, pitches: [upper.pitches[0], pitch] as [Pitch, Pitch] }, ...value.voices.slice(1)] };
    const nextIssues = analyzeVoiceLeading(next);
    const count = attempts + 1;
    const targetMatched = pitchToMidi(pitch) === pitchToMidi(targetPitch);
    const correct = nextIssues.length === 0 && targetMatched;
    setValue(next);
    setAttempts(count);
    if (correct) {
      setFeedback(`정답입니다. 소프라노가 ${pitchName(upper.pitches[0])}에서 ${pitchName(pitch)}로 내려가 베이스와 반대 방향으로 움직입니다.`);
      onComplete?.({ response: next, correct: true, attempts: count });
    } else if (nextIssues.length) {
      setFeedback('아직 병행8도입니다. 두 성부가 모두 위로 한 단계 움직이고 있습니다.');
    } else if (pitchToMidi(pitch) >= pitchToMidi(upper.pitches[0])) {
      setFeedback('병행8도는 사라졌지만 목표와 다릅니다. 소프라노를 아래 방향으로 한 단계 움직여 보세요.');
    } else {
      setFeedback('방향은 맞지만 한 단계가 아닙니다. C5 바로 아래의 흰 건반을 선택해 보세요.');
    }
  };
  return <section className="music-activity"><p className="section-label">MUSIC · VOICE LEADING</p><h2>{title}</h2><p className="activity-instruction"><strong>목표</strong> {input.instruction ?? '소프라노를 아래 방향으로 한 단계 움직여 병행을 고치세요.'}</p><div className={issues.length ? 'voice-frame has-error' : 'voice-frame'}><Staff pitches={[upper.pitches[0], lower.pitches[0], upper.pitches[1], lower.pitches[1]]} /><p>{upper.name}: {upper.pitches.map(pitchName).join(' → ')}</p><p>{lower.name}: {lower.pitches.map((pitchName).join(' → ')}</p></div><Keyboard selected={[]] onSelect={choose} fromMidi={60} toMidi={72} /><p className={feedback.startsWith('정답') ? 'play-status feedback--success' : 'play-status'} aria-live="polite">{feedback}</p></section>;
}
