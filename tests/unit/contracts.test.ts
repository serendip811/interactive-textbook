import { describe, expect, it } from 'vitest';
import { PlaybackSessionController, SubjectToolRegistry } from '../../engine/player/src/index';

describe('engine runtime contracts', () => {
  it('registers subject tools without subject-specific engine imports', () => {
    const registry = new SubjectToolRegistry();
    registry.register({ subject: 'music', kind: 'pitch-name', run: (value) => String(value) });
    expect(registry.resolve('music', 'pitch-name')?.run('C4')).toBe('C4');
  });
  it('aborts the previous playback when a new session starts', () => {
    const sessions = new PlaybackSessionController();
    const first = sessions.start('example.one');
    const second = sessions.start('example.two');
    expect(first.signal.aborted).toBe(true);
    expect(second.signal.aborted).toBe(false);
    expect(sessions.activeSessionId).toBe(second.id);
  });
});
