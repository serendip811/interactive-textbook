import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';

const lesson = harmonyBook.parts[0].lessons.find((item) => item.id === 'harmony.lesson.voice-leading');

describe('voice-leading representative lesson content', () => {
  it('states the starting pitch, target pitch, and contrary-motion goal', () => {
    const block = lesson?.blocks.find((item) => item.id === 'harmony.block.voice-leading.editor');
    const input = (block?.data as { input: { instruction: string; targetPitch: { step: string; octave: number } } }).input;
    expect(input.instruction).toContain('시작음 C5');
    expect(input.instruction).toContain('반대 방향');
    expect(input.targetPitch).toMatchObject({ step: 'B', octave: 4 });
  });
});
