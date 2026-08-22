import { pitchToMidi, type Pitch } from '@interactive-textbook/subject-music';
export function synthesizePitches(audio: AudioContext, pitches: Pitch[], durationMs: number, volume = .12): void {
  const now = audio.currentTime; const duration = durationMs / 1000;
  for (const pitch of pitches) { const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.frequency.value = 440 * 2 ** ((pitchToMidi(pitch) - 69) / 12); gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(volume, now + .02); gain.gain.exponentialRampToValueAtTime(.0001, now + Math.max(.04, duration - .04)); oscillator.connect(gain).connect(audio.destination); oscillator.start(now); oscillator.stop(now + duration); }
}
