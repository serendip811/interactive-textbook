import { schemaVersion, type Book } from '@interactive-textbook/schema';
import type { Pitch } from '@interactive-textbook/subject-music';

export const harmonyBookId = 'harmony' as const;
const E4: Pitch = { step: 'E', alter: 0, octave: 4 };
const F4: Pitch = { step: 'F', alter: 0, octave: 4 };
const B4: Pitch = { step: 'B', alter: 0, octave: 4 };
const C5: Pitch = { step: 'C', alter: 0, octave: 5 };
const C4: Pitch = { step: 'C', alter: 0, octave: 4 };
const Cs4: Pitch = { step: 'C', alter: 1, octave: 4 };
const D4: Pitch = { step: 'D', alter: 0, octave: 4 };

export const harmonyBook: Book = {
  id: harmonyBookId, schemaVersion, contentVersion: '0.2.0', engineVersion: '0.1.0', subject: 'music', title: '화성학', description: '보고, 듣고, 조작하며 이해하는 화성학 교재', language: 'ko-KR',
  parts: [{ id: 'harmony.part.pitch', title: 'PART 1. 음', lessons: [{
    id: 'harmony.lesson.semitone', title: '1-2. 반음과 온음', summary: '두 음 사이의 가장 작은 기본 거리를 직접 확인합니다.', estimatedMinutes: 10,
    prerequisiteRefs: ['harmony.lesson.pitch-properties'],
    objectives: [{ id: 'harmony.objective.semitone', title: '두 음 사이의 반음 수를 확인하고 반음과 온음을 구별한다.' }],
    data: [
      { id: 'harmony.data.semitone.natural', subject: 'music', kind: 'pitch-pairs', value: [[E4, F4], [B4, C5]] },
      { id: 'harmony.data.semitone.accidental', subject: 'music', kind: 'pitch-pairs', value: [[C4, Cs4], [C4, D4]] },
    ],
    blocks: [
      { id: 'harmony.block.semitone.concept', type: 'content.markdown', objectiveRefs: ['harmony.objective.semitone'], data: { markdown: '**반음**은 서양음악에서 가장 작은 기본 거리입니다. 건반에서 바로 이웃한 두 음 사이가 반음입니다.\n\n**온음**은 반음 두 개로 이루어집니다. E–F와 B–C는 흰건반끼리 붙어 있어 반음 관계입니다.' } },
      { id: 'harmony.block.semitone.example', type: 'activity.subject', objectiveRefs: ['harmony.objective.semitone'], dataRefs: ['harmony.data.semitone.natural'], data: { subject: 'music', tool: 'pitch-pair-viewer', title: 'E–F, B–C를 보고 들어보기', input: { pairs: [[E4, F4], [B4, C5]], interactive: false } } },
      { id: 'harmony.block.semitone.explorer', type: 'activity.subject', objectiveRefs: ['harmony.objective.semitone'], dataRefs: ['harmony.data.semitone.accidental'], data: { subject: 'music', tool: 'semitone-explorer', title: '건반에서 두 음의 거리 찾기', input: { initial: [C4, Cs4], range: { fromMidi: 60, toMidi: 72 } } } },
      { id: 'harmony.block.semitone.check', type: 'assessment.multiple-choice', objectiveRefs: ['harmony.objective.semitone'], data: { prompt: 'C4에서 D4까지의 거리는 무엇일까요?', options: [{ id: 'half', label: '반음' }, { id: 'whole', label: '온음' }, { id: 'octave', label: '옥타브' }], answer: 'whole', explanation: 'C–C♯, C♯–D의 두 반음이므로 온음입니다.' } },
      { id: 'harmony.block.semitone.summary', type: 'content.summary', objectiveRefs: ['harmony.objective.semitone'], data: { title: '핵심 정리', items: ['반음은 인접한 두 건반 사이의 거리입니다.', '온음은 반음 두 개입니다.', 'E–F와 B–C는 자연음끼리의 반음입니다.'] } },
    ],
    completion: { type: 'required-blocks', blockRefs: ['harmony.block.semitone.explorer', 'harmony.block.semitone.check'] },
  }] }],
};
