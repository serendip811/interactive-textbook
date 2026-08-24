import { blockVersion, schemaVersion, type Book } from '@interactive-textbook/schema';
import type { Pitch } from '@interactive-textbook/subject-music';
import { batchAPart0, batchAPart1After, batchAPart1Before, batchAPart2After, batchAPart2Before } from './batch-a';

export const harmonyBookId = 'harmony' as const;
const E4: Pitch = { step: 'E', alter: 0, octave: 4 };
const F4: Pitch = { step: 'F', alter: 0, octave: 4 };
const A4: Pitch = { step: 'A', alter: 0, octave: 4 };
const B4: Pitch = { step: 'B', alter: 0, octave: 4 };
const C5: Pitch = { step: 'C', alter: 0, octave: 5 };
const C4: Pitch = { step: 'C', alter: 0, octave: 4 };
const Cs4: Pitch = { step: 'C', alter: 1, octave: 4 };
const D4: Pitch = { step: 'D', alter: 0, octave: 4 };

export const harmonyBook: Book = {
  id: harmonyBookId, schemaVersion, contentVersion: '0.4.0', engineVersion: '0.2.0', subject: 'music', title: '화성학', description: '보고, 듣고, 조작하며 이해하는 화성학 교재', language: 'ko-KR',
  parts: [batchAPart0, { id: 'harmony.part.pitch', title: 'PART 1. 음', lessons: [...batchAPart1Before, {
    id: 'harmony.lesson.semitone', title: '1-2. 반음과 온음', summary: '두 음 사이의 가장 작은 기본 거리를 직접 확인합니다.', estimatedMinutes: 10, prerequisiteRefs: ['harmony.lesson.pitch-properties.lesson'],
    objectives: [{ id: 'harmony.objective.semitone', title: '두 음 사이의 반음 수를 확인하고 반음과 온음을 구별한다.' }],
    data: [
      { id: 'harmony.data.semitone.natural', subject: 'music', kind: 'pitch-pairs', value: [[E4, F4], [B4, C5]] },
      { id: 'harmony.data.semitone.accidental', subject: 'music', kind: 'pitch-pairs', value: [[C4, Cs4], [C4, D4]] },
    ],
    blocks: [
      { id: 'harmony.block.semitone.concept', blockVersion, type: 'content.markdown', objectiveRefs: ['harmony.objective.semitone'], data: { markdown: '**반음**은 서양음악에서 가장 작은 기본 거리입니다. 건반에서 바로 이웃한 두 음 사이가 반음입니다.\n\n**온음**은 반음 두 개로 이루어집니다. E–F와 B–C는 흰건반끼리 붙어 있어 반음 관계입니다.' } },
      { id: 'harmony.block.semitone.example', blockVersion, type: 'activity.subject', objectiveRefs: ['harmony.objective.semitone'], dataRefs: ['harmony.data.semitone.natural'], data: { subject: 'music', tool: 'pitch-pair-viewer', title: 'E–F, B–C를 보고 들어보기', input: { pairs: [[E4, F4], [B4, C5]], interactive: false } } },
      { id: 'harmony.block.semitone.explorer', blockVersion, type: 'activity.subject', objectiveRefs: ['harmony.objective.semitone'], dataRefs: ['harmony.data.semitone.accidental'], data: { subject: 'music', tool: 'semitone-explorer', title: '건반에서 두 음의 거리 찾기', input: { initial: [C4, Cs4], range: { fromMidi: 60, toMidi: 72 } } } },
      { id: 'harmony.block.semitone.check', blockVersion, type: 'assessment.multiple-choice', objectiveRefs: ['harmony.objective.semitone'], data: { prompt: 'C4에서 D4까지의 거리는 무엇일까요?', options: [{ id: 'half', label: '반음' }, { id: 'whole', label: '온음' }, { id: 'octave', label: '옥타브' }], answer: 'whole', explanation: 'C–C♯, C♯–D의 두 반음이므로 온음입니다.' } },
      { id: 'harmony.block.semitone.summary', blockVersion, type: 'content.summary', objectiveRefs: ['harmony.objective.semitone'], data: { title: '핵심 정리', items: ['반음은 인접한 두 건반 사이의 거리입니다.', '온음은 반음 두 개입니다.', 'E–F와 B–C는 자연음끼리의 반음입니다.'] } },
    ],
    completion: { type: 'required-blocks', blockRefs: ['harmony.block.semitone.explorer', 'harmony.block.semitone.check'] },
  }, ...batchAPart1After] }, { id: 'harmony.part.intervals', title: 'PART 2. 음정', lessons: [...batchAPart2Before, {
    id: 'harmony.lesson.interval', title: '2-3. 음정의 종류', summary: '도수와 반음 수를 함께 사용해 음정의 이름을 찾습니다.', estimatedMinutes: 12, prerequisiteRefs: ['harmony.lesson.interval-degree.lesson'],
    objectives: [{ id: 'harmony.objective.interval', title: '두 음의 도수·반음 수·성질을 판정하고 목표 음정을 만든다.' }],
    data: [{ id: 'harmony.data.interval.examples', subject: 'music', kind: 'pitch-pairs', value: [[C4, D4], [C4, { step: 'E', alter: -1, octave: 4 }], [D4, A4]] }],
    blocks: [
      { id: 'harmony.block.interval.concept', blockVersion, type: 'content.markdown', objectiveRefs: ['harmony.objective.interval'], data: { markdown: '음정의 **도수**는 음 이름을 시작과 끝까지 세어 구합니다. C–E는 C, D, E의 3도입니다.\n\n같은 3도라도 반음 수가 4개면 장3도, 3개면 단3도입니다. 1·4·5·8도는 완전 계열, 2·3·6·7도는 장·단 계열을 기본으로 합니다.' } },
      { id: 'harmony.block.interval.examples', blockVersion, type: 'activity.subject', objectiveRefs: ['harmony.objective.interval'], dataRefs: ['harmony.data.interval.examples'], data: { subject: 'music', tool: 'pitch-pair-viewer', title: '대표 음정을 비교해 듣기', input: { pairs: [[C4, D4], [C4, { step: 'E', alter: -1, octave: 4 }], [D4, A4]] } } },
      { id: 'harmony.block.interval.builder', blockVersion, type: 'activity.subject', objectiveRefs: ['harmony.objective.interval'], data: { subject: 'music', tool: 'interval-builder', title: 'C4에서 완전5도 만들기', input: { initial: [C4], target: { degree: 5, quality: 'perfect' }, range: { fromMidi: 60, toMidi: 72 } } } },
      { id: 'harmony.block.interval.summary', blockVersion, type: 'content.summary', objectiveRefs: ['harmony.objective.interval'], data: { items: ['도수는 음 이름을 포함해 셉니다.', '도수와 반음 수를 함께 봐야 정확한 음정 이름을 알 수 있습니다.', 'C♯과 D♭은 같은 높이여도 음정 도수는 달라질 수 있습니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['harmony.block.interval.builder'] },
  }, ...batchAPart2After] }, { id: 'harmony.part.chords', title: 'PART 4. 화음', lessons: [{
    id: 'harmony.lesson.triad', title: '4-2. 3화음', summary: '근음 위에 3도씩 쌓인 세 음의 구조와 소리를 비교합니다.', estimatedMinutes: 12, prerequisiteRefs: ['harmony.lesson.interval'],
    objectives: [{ id: 'harmony.objective.triad', title: '장·단·감·증3화음을 구별하고 구성음을 선택한다.' }],
    data: [{ id: 'harmony.data.triad.examples', subject: 'music', kind: 'chords', value: [
      { id: 'music.chord.f-major', root: F4, bass: F4, pitches: [F4, A4, C5], symbol: 'F' },
      { id: 'music.chord.f-minor', root: F4, bass: F4, pitches: [F4, { step: 'A', alter: -1, octave: 4 }, C5], symbol: 'Fm' },
    ] }],
    blocks: [
      { id: 'harmony.block.triad.concept', blockVersion, type: 'content.markdown', objectiveRefs: ['harmony.objective.triad'], data: { markdown: '3화음은 근음에서 3도씩 쌓은 세 음입니다. 근음에서 3음과 5음까지의 반음 구조에 따라 장·단·감·증3화음으로 나뉩니다.\n\n장3화음은 4+3, 단3화음은 3+4, 감3화음은 3+3, 증3화음은 4+4 반음 구조입니다.' } },
      { id: 'harmony.block.triad.examples', blockVersion, type: 'activity.subject', objectiveRefs: ['harmony.objective.triad'], dataRefs: ['harmony.data.triad.examples'], data: { subject: 'music', tool: 'pitch-pair-viewer', title: 'F장3화음과 F단3화음 비교', input: { pairs: [[F4, A4, C5], [F4, { step: 'A', alter: -1, octave: 4 }, C5]] } } },
      { id: 'harmony.block.triad.builder', blockVersion, type: 'activity.subject', objectiveRefs: ['harmony.objective.triad'], data: { subject: 'music', tool: 'chord-builder', title: 'C장3화음 구성음 고르기', input: { targetPitches: [C4, { step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }], range: { fromMidi: 60, toMidi: 72 } } } },
      { id: 'harmony.block.triad.summary', blockVersion, type: 'content.summary', objectiveRefs: ['harmony.objective.triad'], data: { items: ['3화음은 근음·3음·5음으로 이루어집니다.', '구성음의 반음 구조가 화음의 성질을 정합니다.', '기본형과 자리바꿈은 구성음은 같고 베이스음이 다릅니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['harmony.block.triad.builder'] },
  }] }, { id: 'harmony.part.cadences', title: 'PART 8. 종지', lessons: [{
    id: 'harmony.lesson.cadence', title: '8-5. 종지의 활용', summary: '진행의 마지막 두 화음을 듣고 종지의 해결감을 구별합니다.', estimatedMinutes: 12, prerequisiteRefs: ['harmony.lesson.triad'],
    objectives: [{ id: 'harmony.objective.cadence', title: '전체·단계 재생을 비교하고 종지 유형을 판별한다.' }],
    data: [{ id: 'harmony.data.cadence.examples', subject: 'music', kind: 'progressions', value: [
      { id: 'music.progression.authentic', mode: 'sequential', cadenceType: 'authentic', steps: [{ chord: { id: 'music.chord.g7', root: { step: 'G', alter: 0, octave: 3 }, bass: { step: 'G', alter: 0, octave: 3 }, pitches: [{ step: 'G', alter: 0, octave: 3 }, { step: 'B', alter: 0, octave: 3 }, { step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 }], symbol: 'V7' }, startsAtMs: 0, durationMs: 900 }, { chord: { id: 'music.chord.c-resolution', root: C4, bass: C4, pitches: [C4, { step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }], symbol: 'I' }, startsAtMs: 900, durationMs: 1200 }] },
      { id: 'music.progression.half', mode: 'sequential', cadenceType: 'half', steps: [{ chord: { id: 'music.chord.c-start', root: C4, bass: C4, pitches: [C4, { step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }], symbol: 'I' }, startsAtMs: 0, durationMs: 900 }, { chord: { id: 'music.chord.g-end', root: { step: 'G', alter: 0, octave: 3 }, bass: { step: 'G', alter: 0, octave: 3 }, pitches: [{ step: 'G', alter: 0, octave: 3 }, { step: 'B', alter: 0, octave: 3 }, { step: 'D', alter: 0, octave: 4 }], symbol: 'V' }, startsAtMs: 900, durationMs: 1200 }] },
    ] }, { id: 'harmony.data.cadence.quiz', subject: 'music', kind: 'progressions', value: [
      { id: 'music.progression.quiz-authentic-f', mode: 'sequential', cadenceType: 'authentic', steps: [{ chord: { id: 'music.chord.c7', root: C4, bass: C4, pitches: [C4, E4, { step: 'G', alter: 0, octave: 4 }, { step: 'B', alter: -1, octave: 4 }], symbol: 'V7' }, startsAtMs: 0, durationMs: 900 }, { chord: { id: 'music.chord.f-resolution', root: F4, bass: F4, pitches: [F4, A4, C5], symbol: 'I' }, startsAtMs: 900, durationMs: 1200 }] },
    ] }],
    blocks: [
      { id: 'harmony.block.cadence.concept', blockVersion, type: 'content.markdown', objectiveRefs: ['harmony.objective.cadence'], data: { markdown: '종지는 음악의 문장 끝에 오는 화음 진행입니다. **정격종지 V–I**는 으뜸화음으로 해결되어 강한 마침을 만들고, **반종지**는 V에서 멈춰 계속될 듯한 느낌을 줍니다.' } },
      { id: 'harmony.block.cadence.player', blockVersion, type: 'activity.subject', objectiveRefs: ['harmony.objective.cadence'], dataRefs: ['harmony.data.cadence.examples'], data: { subject: 'music', tool: 'progression-player', title: '전체 진행과 한 단계씩 비교하기', input: { progressions: [] } } },
      { id: 'harmony.block.cadence.listener', blockVersion, type: 'activity.subject', objectiveRefs: ['harmony.objective.cadence'], dataRefs: ['harmony.data.cadence.quiz'], data: { subject: 'music', tool: 'cadence-listener', title: '새로운 진행을 듣고 판별하기', input: { progressions: [], target: 'authentic', answerTypes: ['authentic', 'half'], hideAnalysisUntilAnswer: true } } },
      { id: 'harmony.block.cadence.summary', blockVersion, type: 'content.summary', objectiveRefs: ['harmony.objective.cadence'], data: { items: ['정격종지는 V에서 I로 해결됩니다.', '반종지는 V에서 멈춥니다.', '마지막 화음과 해결감을 함께 들어야 합니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['harmony.block.cadence.listener'] },
  }] }, { id: 'harmony.part.voice-leading', title: 'PART 15. 성부진행', lessons: [{
    id: 'harmony.lesson.voice-leading', title: '15-2. 병행5도와 병행8도', summary: '두 성부가 같은 방향으로 움직일 때 생기는 완전음정의 병행을 찾아 고칩니다.', estimatedMinutes: 12, prerequisiteRefs: ['harmony.lesson.interval'], objectives: [{ id: 'harmony.objective.voice-leading', title: '병행5도·8도를 발견하고 한 성부를 수정한다.' }],
    blocks: [
      { id: 'harmony.block.voice-leading.concept', blockVersion, type: 'content.markdown', objectiveRefs: ['harmony.objective.voice-leading'], data: { markdown: '두 성부가 같은 방향으로 움직이며 완전5도에서 완전5도, 또는 완전8도에서 완전8도로 이어지면 병행5도·병행8도입니다. 먼저 한 성부의 도착음을 바꾸어 독립적인 선율을 만들어 봅니다.' } },
      { id: 'harmony.block.voice-leading.editor', blockVersion, type: 'activity.subject', objectiveRefs: ['harmony.objective.voice-leading'], data: { subject: 'music', tool: 'voice-leading-editor', title: '반대 방향으로 병행8도 고치기', input: { targetPitch: B4, instruction: '시작음 C5에서 소프라노를 아래 방향으로 한 단계 움직여, 위로 움직이는 베이스와 반대 방향을 만드세요.', value: { id: 'music.voice-leading.parallel-octave', voices: [{ id: 'soprano', name: '소프라노', pitches: [C5, { step: 'D', alter: 0, octave: 5 }] }, { id: 'bass', name: '베이스', pitches: [C4, D4] }] } } } },
      { id: 'harmony.block.voice-leading.summary', blockVersion, type: 'content.summary', objectiveRefs: ['harmony.objective.voice-leading'], data: { items: ['두 성부의 시작과 도착 음정을 함께 봅니다.', '같은 방향의 완전5도·8도 연속을 피합니다.', 'v0.1에서는 한 성부의 도착음 수정에 집중합니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['harmony.block.voice-leading.editor'] },
  }] }],
};
