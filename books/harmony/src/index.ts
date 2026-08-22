import { schemaVersion, type Book } from '@interactive-textbook/schema';
export const harmonyBookId = 'harmony' as const;
export const harmonyBook: Book = {
  id: harmonyBookId, schemaVersion, contentVersion: '0.1.0', engineVersion: '0.1.0', subject: 'music', title: '화성학', description: '보고, 듣고, 조작하며 이해하는 화성학 교재', language: 'ko-KR',
  parts: [{ id: 'harmony.part.pitch', title: '음의 기초', lessons: [
    { id: 'harmony.lesson.pitch', title: '음의 높이와 이름', summary: '음이 어떻게 구별되는지 살펴봅니다.', estimatedMinutes: 5, objectives: [{ id: 'harmony.objective.pitch', title: '음의 높이와 이름을 구별한다.' }], blocks: [
      { id: 'harmony.block.pitch.intro', type: 'content.markdown', objectiveRefs: ['harmony.objective.pitch'], data: { markdown: '음은 높이에 따라 이름이 달라집니다. 같은 C라도 옥타브가 다르면 서로 다른 높이로 들립니다.\n\n이 교재에서는 C4처럼 음 이름과 옥타브를 함께 적습니다.' } },
      { id: 'harmony.block.pitch.callout', type: 'content.callout', objectiveRefs: ['harmony.objective.pitch'], data: { title: '기억하기', body: 'C4는 가운데 도를 뜻합니다.', tone: 'tip' } },
      { id: 'harmony.block.pitch.activity', type: 'activity.subject', objectiveRefs: ['harmony.objective.pitch'], data: { subject: 'music', tool: 'keyboard', title: '건반에서 C4 찾기', input: { pitches: [{ step: 'C', alter: 0, octave: 4 }] } } },
    ], completion: { type: 'all-objectives' } },
    { id: 'harmony.lesson.semitone', title: '반음과 온음', summary: '가장 작은 음정의 간격을 구별합니다.', estimatedMinutes: 8, prerequisiteRefs: ['harmony.lesson.pitch'], objectives: [{ id: 'harmony.objective.semitone', title: '반음과 온음을 구별한다.' }], blocks: [
      { id: 'harmony.block.semitone.intro', type: 'content.markdown', objectiveRefs: ['harmony.objective.semitone'], data: { markdown: '건반에서 바로 이웃한 두 음의 거리를 반음이라고 합니다. 반음 두 개가 모이면 온음입니다.' } },
      { id: 'harmony.block.semitone.quiz', type: 'assessment.multiple-choice', objectiveRefs: ['harmony.objective.semitone'], data: { prompt: '반음 두 개를 합한 간격은 무엇일까요?', options: [{ id: 'half', label: '반음' }, { id: 'whole', label: '온음' }, { id: 'octave', label: '옥타브' }], answer: 'whole', explanation: '반음 두 개를 합하면 온음입니다.' } },
      { id: 'harmony.block.semitone.summary', type: 'content.summary', objectiveRefs: ['harmony.objective.semitone'], data: { title: '오늘의 핵심', items: ['이웃한 건반 사이의 거리는 반음입니다.', '반음 두 개는 온음입니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['harmony.block.semitone.quiz'] } },
  ] }],
};
