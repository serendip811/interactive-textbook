import { describe, expect, it } from 'vitest';
import { PlaybackSessionController, SubjectToolRegistry, type EngineEvent } from '../../engine/player/src/index';

describe('engine runtime contracts', () => {
  it('registers subject tools without subject-specific engine imports', () => {
    const registry = new SubjectToolRegistry();
    registry.register({ subject: 'music', kind: 'pitch-name', run: (value) => String(value) });
    registry.register({ subject: 'math', kind: 'linear-value', run: (value) => Number(value) * 2 + 1 });
    expect(registry.resolve('music', 'pitch-name')?.run('C4')).toBe('C4');
    expect(registry.resolve('math', 'linear-value')?.run(3)).toBe(7);
  });
  it('uses subject-neutral activity and assessment event names', () => {
    const events: EngineEvent[] = [
      { type: 'activity.completed', activityId: 'example.activity', timestamp: '2026-08-24T00:00:00.000Z' },
      { type: 'assessment.submitted', assessmentId: 'example.assessment', result: { correct: true, score: 1, feedback: { tone: 'success', title: '완료', message: '통과' } }, timestamp: '2026-08-24T00:00:00.000Z' },
    ];
    expect(events.map((event) => event.type)).toEqual(['activity.completed', 'assessment.submitted']);
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
