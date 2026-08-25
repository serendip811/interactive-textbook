import { blockVersion, type Lesson, type Part } from '@interactive-textbook/schema';
import type { Pitch } from '@interactive-textbook/subject-music';

const pitch = (step: Pitch['step'], octave: number, alter: Pitch['alter'] = 0): Pitch => ({ step, alter, octave });
const C3 = pitch('C', 3); const C4 = pitch('C', 4); const D4 = pitch('D', 4);
const E4 = pitch('E', 4); const F4 = pitch('F', 4); const Fs4 = pitch('F', 4, 1); const G4 = pitch('G', 4);
const A4 = pitch('A', 4); const B4 = pitch('B', 4); const Bb4 = pitch('B', 4, -1); const C5 = pitch('C', 5); const D5 = pitch('D', 5);

interface LessonDraft {
  id: string;
  legacy: string;
  title: string;
  summary: string;
  objective: string;
  markdown: string;
  pairs: Pitch[][];
  activityTitle: string;
  prompt: string;
  options: Array<{ id: string; label: string }>;
  answer: string;
  explanation: string;
  items: string[];
  prerequisiteRefs?: string[];
}

function lesson(draft: LessonDraft): Lesson {
  const prefix = `harmony.${draft.id}`;
  const objectiveId = `${prefix}.objective`;
  const dataId = `${prefix}.data.examples`;
  const activityId = `${prefix}.block.examples`;
  const assessmentId = `${prefix}.block.check`;
  return {
    id: `${prefix}.lesson`,
    title: `${draft.legacy}. ${draft.title}`,
    summary: draft.summary,
    estimatedMinutes: 8,
    prerequisiteRefs: draft.prerequisiteRefs,
    objectives: [{ id: objectiveId, title: draft.objective }],
    data: [{ id: dataId, subject: 'music', kind: 'pitch-groups', value: draft.pairs }],
    blocks: [
      { id: `${prefix}.block.concept`, blockVersion, type: 'content.markdown', objectiveRefs: [objectiveId], data: { markdown: draft.markdown } },
      { id: activityId, blockVersion, type: 'activity.subject', objectiveRefs: [objectiveId], dataRefs: [dataId], data: { subject: 'music', tool: 'pitch-pair-viewer', title: draft.activityTitle, input: { pairs: draft.pairs, interactive: false } } },
      { id: assessmentId, blockVersion, type: 'assessment.multiple-choice', objectiveRefs: [objectiveId], data: { prompt: draft.prompt, options: draft.options, answer: draft.answer, explanation: draft.explanation } },
      { id: `${prefix}.block.summary`, blockVersion, type: 'content.summary', objectiveRefs: [objectiveId], data: { items: draft.items } },
    ],
    completion: { type: 'required-blocks', blockRefs: [assessmentId] },
  };
}

export const batchAPart0: Part = {
  id: 'harmony.part.introduction',
  title: 'PART 0. 시작하기',
  lessons: [
    lesson({
      id: 'lesson.introduction', legacy: '0-1', title: '화성학이란 무엇인가', summary: '멜로디와 화성의 관점을 구분하고 화성의 역할을 살펴봅니다.',
      objective: '수평적 멜로디와 수직적 화성의 차이를 설명한다.',
      markdown: '화성학은 **동시에 울리는 음들의 관계**와 화음이 시간 속에서 연결되는 방식을 연구합니다. 멜로디가 음의 수평적 흐름이라면 화성은 수직적 관계와 그 진행을 함께 다룹니다.\n\n아래 C–E–G는 세 음이 함께 울리는 첫 예시입니다. 지금은 이름을 외우기보다 악보·건반·소리가 같은 세 음을 가리키는지만 확인해 보세요.',
      pairs: [[C4, E4, G4]], activityTitle: 'C장3화음을 보고 들어보기',
      prompt: '화성학이 주로 다루는 것은 무엇인가요?', options: [{ id: 'harmony', label: '동시에 울리는 음과 화음의 연결' }, { id: 'tempo', label: '연주 속도만' }, { id: 'lyrics', label: '가사의 운율만' }], answer: 'harmony', explanation: '화성학은 동시에 울리는 음의 관계와 화음 진행을 함께 다룹니다.',
      items: ['멜로디는 음의 수평적 흐름입니다.', '화성은 동시에 울리는 음의 수직적 관계입니다.', '화음 진행은 긴장과 이완을 만듭니다.'],
    }),
    lesson({
      id: 'lesson.foundations', legacy: '0-2', title: '학습에 필요한 기초', summary: '음이름, 옥타브, 오선보와 건반을 연결합니다.',
      objective: 'C부터 G까지의 음이름을 악보·건반·소리에서 연결한다.', prerequisiteRefs: ['harmony.lesson.introduction.lesson'],
      markdown: '화성학을 시작하려면 음이름, 옥타브, 오선보, 음자리표와 건반 구조를 읽을 수 있어야 합니다. 완벽한 초견보다 **음의 위치와 반음 관계**를 정확히 연결하는 것이 중요합니다.',
      pairs: [[C4], [D4], [E4], [F4], [G4]], activityTitle: 'C4부터 G4까지 차례로 확인하기',
      prompt: 'C4 다음의 자연음은 무엇인가요?', options: [{ id: 'd4', label: 'D4' }, { id: 'cs4', label: 'C♯4' }, { id: 'c5', label: 'C5' }], answer: 'd4', explanation: '자연음 이름 순서에서 C 다음은 D입니다.',
      items: ['음이름은 C–D–E–F–G–A–B 순서로 반복됩니다.', '옥타브 숫자는 같은 음이름의 높이 영역을 구분합니다.', '악보·건반·소리를 같은 음 데이터로 연결합니다.'],
    }),
  ],
};

export const batchAPart1Before: Lesson[] = [lesson({
  id: 'lesson.pitch-properties', legacy: '1-1', title: '음의 성질', summary: '음의 높이·길이·세기·음색 중 화성학이 주목하는 요소를 살펴봅니다.',
  objective: '같은 음이름이 옥타브에 따라 반복되는 원리를 설명한다.', prerequisiteRefs: ['harmony.lesson.foundations.lesson'],
  markdown: '음은 높이, 길이, 세기, 음색으로 구분할 수 있습니다. 화성학에서는 특히 **음고와 음 사이의 거리**, 그리고 여러 음이 동시에 울릴 때의 관계가 중요합니다.',
  pairs: [[C3], [C4], [C5]], activityTitle: '세 옥타브의 C 비교하기',
  prompt: 'C3, C4, C5의 공통점은 무엇인가요?', options: [{ id: 'name', label: '같은 C 음이름이다' }, { id: 'height', label: '높이가 완전히 같다' }, { id: 'duration', label: '길이가 항상 같다' }], answer: 'name', explanation: '옥타브는 다르지만 모두 C라는 같은 음이름을 가집니다.',
  items: ['옥타브가 달라도 음이름은 반복됩니다.', '옥타브가 올라가면 음높이는 높아집니다.', '화성학에서는 음고와 음 사이의 관계가 핵심입니다.'],
})];

export const batchAPart1After: Lesson[] = [
  lesson({
    id: 'lesson.accidentals', legacy: '1-3', title: '변화표', summary: '샵·플랫·제자리표가 음높이를 어떻게 바꾸는지 확인합니다.',
    objective: '변화표를 적용한 음의 이름과 실제 높이를 판별한다.', prerequisiteRefs: ['harmony.lesson.semitone'],
    markdown: '**♯(샵)**은 음을 반음 올리고 **♭(플랫)**은 반음 내립니다. **♮(제자리표)**는 앞에서 적용된 변화표의 효과를 취소합니다. F♯과 G♭처럼 같은 건반도 문맥에 따라 다른 이름으로 적을 수 있습니다.',
    pairs: [[F4, Fs4], [B4, Bb4]], activityTitle: 'F–F♯과 B–B♭ 비교하기',
    prompt: 'B♭은 B보다 어떻게 달라지나요?', options: [{ id: 'down', label: '반음 낮아진다' }, { id: 'up', label: '반음 높아진다' }, { id: 'same', label: '변하지 않는다' }], answer: 'down', explanation: '플랫은 기준음을 반음 낮춥니다.',
    items: ['샵은 반음 올립니다.', '플랫은 반음 내립니다.', '제자리표는 변화표를 취소합니다.'],
  }),
  lesson({
    id: 'lesson.scale-concept', legacy: '1-4', title: '음계의 개념', summary: '일정한 간격 구조를 가진 음의 순서를 확인합니다.',
    objective: '음계와 단순한 음 나열의 차이를 설명한다.', prerequisiteRefs: ['harmony.lesson.accidentals.lesson'],
    markdown: '음계는 음을 아무렇게나 나열한 것이 아니라 **일정한 음정 구조**에 따라 배열한 것입니다. 화음은 대개 특정 음계의 음을 재료로 조직되므로, 음계는 조성과 화음을 이해하는 출발점입니다.',
    pairs: [[C4], [D4], [E4], [F4], [G4], [A4], [B4], [C5]], activityTitle: 'C음계의 자연음 순서 확인하기',
    prompt: 'C장음계에서 B 다음에 오는 음은 무엇인가요?', options: [{ id: 'c5', label: 'C5' }, { id: 'cs5', label: 'C♯5' }, { id: 'a4', label: 'A4' }], answer: 'c5', explanation: '자연음 이름은 B 다음에 다시 C로 이어집니다.',
    items: ['음계는 일정한 간격 구조를 가집니다.', '음계의 음은 화음의 주요 재료가 됩니다.', '자연음 이름은 일곱 개 뒤 다시 반복됩니다.'],
  }),
];

export const batchAPart2Before: Lesson[] = [
  lesson({
    id: 'lesson.interval-introduction', legacy: '2-1', title: '음정이란', summary: '두 음 사이의 거리를 도수와 성질로 읽는 순서를 익힙니다.',
    objective: '두 음 사이의 음이름을 포함해 기본 도수를 센다.', prerequisiteRefs: ['harmony.lesson.scale-concept.lesson'],
    markdown: '두 음 사이가 얼마나 떨어져 있는지를 **음정(interval)**이라고 합니다. 먼저 음이름을 세어 몇 도인지 구하고, 그다음 반음 수를 이용해 완전·장·단·증·감의 성질을 판별합니다.',
    pairs: [[C4, E4], [C4, G4]], activityTitle: 'C–E와 C–G의 거리 비교하기',
    prompt: 'C부터 E까지 시작음과 끝음을 포함해 세면 몇 도인가요?', options: [{ id: 'third', label: '3도' }, { id: 'second', label: '2도' }, { id: 'fourth', label: '4도' }], answer: 'third', explanation: 'C(1), D(2), E(3)이므로 3도입니다.',
    items: ['음정은 두 음 사이의 거리입니다.', '도수는 시작음과 끝음을 모두 포함해 셉니다.', '정확한 이름에는 도수와 반음 수가 모두 필요합니다.'],
  }),
  lesson({
    id: 'lesson.interval-degree', legacy: '2-2', title: '도수 계산', summary: '변화표와 관계없이 음이름 글자 수로 도수를 계산합니다.',
    objective: '변화표를 무시하고 시작음과 끝음을 포함해 도수를 계산한다.', prerequisiteRefs: ['harmony.lesson.interval-introduction.lesson'],
    markdown: '도수를 계산할 때는 시작음과 끝음을 모두 포함합니다. 변화표는 도수에 영향을 주지 않으므로 C–E, C♯–E, C–E♭는 모두 **3도**입니다. 변화표는 다음 단계에서 음정의 성질을 정할 때 사용합니다.',
    pairs: [[C4, F4], [D4, A4], [E4, B4]], activityTitle: '4도와 5도 음정 비교하기',
    prompt: 'C♯–E♭의 도수는 무엇인가요?', options: [{ id: 'third', label: '3도' }, { id: 'second', label: '2도' }, { id: 'fourth', label: '4도' }], answer: 'third', explanation: '변화표를 제외하고 C–D–E를 세면 3도입니다.',
    items: ['도수는 음이름 글자 순서로 셉니다.', '시작음과 끝음을 모두 포함합니다.', '변화표는 도수가 아니라 성질 판정에 사용합니다.'],
  }),
];

export const batchAPart2After: Lesson[] = [
  lesson({
    id: 'lesson.compound-interval', legacy: '2-4', title: '복음정', summary: '8도를 넘는 음정을 단순음정과 연결해 읽습니다.',
    objective: '복음정에서 7을 빼 대응하는 단순음정을 찾는다.', prerequisiteRefs: ['harmony.lesson.interval'],
    markdown: '8도 안의 음정은 단순음정, 8도를 넘으면 **복음정**입니다. 복음정에서 7을 빼면 같은 계열의 단순음정이 됩니다. 예를 들어 11도는 11−7=4이므로 4도 계열입니다.',
    pairs: [[C4, D5], [C4, F4]], activityTitle: '9도와 단순 2도 계열 비교하기',
    prompt: '11도와 같은 계열의 단순음정은 무엇인가요?', options: [{ id: 'fourth', label: '4도' }, { id: 'third', label: '3도' }, { id: 'fifth', label: '5도' }], answer: 'fourth', explanation: '11−7=4이므로 4도 계열입니다.',
    items: ['8도를 넘는 음정은 복음정입니다.', '복음정에서 7을 빼면 단순음정 계열을 찾을 수 있습니다.', '복음정의 성질은 대응 단순음정과 같습니다.'],
  }),
  lesson({
    id: 'lesson.interval-inversion', legacy: '2-5', title: '음정의 전위', summary: '한 음을 옥타브 이동해 원래 음정과 전위 음정의 관계를 확인합니다.',
    objective: '전위 전후의 도수 합과 성질 변화를 설명한다.', prerequisiteRefs: ['harmony.lesson.compound-interval.lesson'],
    markdown: '아래 음을 한 옥타브 올리거나 위 음을 한 옥타브 내리면 음정이 **전위**됩니다. 전위 전후의 도수는 합이 9이고, 장↔단, 증↔감으로 바뀌며 완전은 완전으로 유지됩니다.',
    pairs: [[C4, E4], [E4, C5]], activityTitle: '장3도와 전위된 단6도 비교하기',
    prompt: '3도를 전위하면 몇 도가 되나요?', options: [{ id: 'sixth', label: '6도' }, { id: 'fifth', label: '5도' }, { id: 'seventh', label: '7도' }], answer: 'sixth', explanation: '전위 전후의 도수 합은 9이므로 9−3=6도입니다.',
    items: ['전위 전후 도수의 합은 9입니다.', '장과 단은 서로 바뀝니다.', '완전음정은 전위해도 완전 계열입니다.'],
  }),
  lesson({
    id: 'lesson.consonance', legacy: '2-6', title: '협화음정과 불협화음정', summary: '안정과 긴장을 만드는 음정을 듣고 문맥에 따른 차이를 살펴봅니다.',
    objective: '협화와 불협화의 기본 인상을 비교하고 문맥의 영향을 설명한다.', prerequisiteRefs: ['harmony.lesson.interval-inversion.lesson'],
    markdown: '**협화음정**은 상대적으로 안정적으로, **불협화음정**은 긴장감이 크게 들립니다. 그러나 완전4도처럼 베이스와 성부 문맥에 따라 취급이 달라지는 경우가 있으므로 “항상 협화”처럼 단순하게 외우지 않습니다.',
    pairs: [[C4, G4], [C4, Fs4]], activityTitle: '완전5도와 증4도의 긴장 비교하기',
    prompt: '일반적으로 C–G 완전5도는 어떻게 들리나요?', options: [{ id: 'stable', label: '상대적으로 안정적이다' }, { id: 'always-wrong', label: '항상 잘못된 음정이다' }, { id: 'same', label: '모든 음정과 똑같다' }], answer: 'stable', explanation: '완전5도는 기본적으로 협화음정에 속하지만 실제 기능은 문맥과 함께 봅니다.',
    items: ['협화는 상대적 안정감을 만듭니다.', '불협화는 긴장과 해결 방향을 만듭니다.', '음정의 취급은 베이스와 성부 문맥에 따라 달라질 수 있습니다.'],
  }),
];
