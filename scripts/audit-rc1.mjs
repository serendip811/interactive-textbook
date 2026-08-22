import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, '..');
const sourcePath = resolve(root, 'legacy/harmony-rc1/harmony_textbook_rc1.html');
const outputPath = resolve(root, 'docs/audits/harmony-rc1-lesson-inventory.md');
const html = readFileSync(sourcePath, 'utf8');

const partPrerequisites = {
  0: '없음',
  1: 'PART 0의 음 이름·옥타브 기초',
  2: 'PART 1의 음·반음·온음·변화표',
  3: 'PART 1의 음계와 PART 2의 음정',
  4: 'PART 2의 음정과 PART 3의 장·단조',
  5: 'PART 4의 3화음과 자리바꿈',
  6: 'PART 3의 조성과 PART 4~5의 화음',
  7: 'PART 6의 다이어토닉 화음과 로마숫자',
  8: 'PART 7의 T·S·D 기능 연결',
  9: 'PART 6~8의 기능과 종지',
  10: 'PART 2의 음정과 PART 9의 화성 진행',
  11: 'PART 5~7의 7화음·도미넌트 기능',
  12: 'PART 3의 조성과 PART 6~7의 기능화성',
  13: 'PART 3·6·11~12의 조성 및 반음계 화성',
  14: 'PART 6~13의 로마숫자·기능·전조',
  15: 'PART 2·4·7~10의 음정·화음·진행',
  16: 'PART 0~15 전체',
};

const representative = new Map([
  ['1-2', 'Engine v0.1 · 반음과 온음'],
  ['2-3', 'Engine v0.1 · 음정'],
  ['4-2', 'Engine v0.1 · 3화음'],
  ['8-5', 'Engine v0.1 · 종지'],
  ['15-2', 'Engine v0.1 · 성부진행'],
  ['14-4', 'Engine v0.2 · 화성분석 스트레스 테스트'],
]);

const objectiveOverrides = {
  '0-1': '화성학이 다루는 수직적 음 관계와 시간적 화음 진행을 설명한다.',
  '0-2': '음 이름·옥타브·악보·건반 표기를 이후 학습에 필요한 수준으로 읽는다.',
  '1-2': '건반에서 반음과 온음의 거리를 직접 세고 구별한다.',
  '2-3': '음정의 도수와 반음 수를 결합해 완전·장·단·증·감을 판정한다.',
  '4-2': '3도 쌓기로 장·단·감·증3화음을 구성하고 소리와 표기를 연결한다.',
  '8-5': '화음 진행을 듣고 네 가지 종지를 구별하며 마침감을 설명한다.',
  '14-4': '악보 문맥에서 로마숫자·기능·종지·전조를 종합적으로 분석한다.',
  '15-2': '병행 5도와 병행 8도를 찾아 수정하고 규칙 위반 이유를 설명한다.',
};

function stripTags(value) {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function objectiveFor(id, title) {
  if (objectiveOverrides[id]) return objectiveOverrides[id];
  if (/분석|실습|종합/.test(title)) return `${title}의 절차를 실제 악보나 진행에 적용하고 근거를 설명한다.`;
  if (/작성|작법|배치|연결 규칙|진행/.test(title)) return `${title}의 원칙을 적용해 예시를 만들고 잘못된 연결을 수정한다.`;
  if (/종지|화음|코드|Tonic|Subdominant|Dominant/.test(title)) return `${title}의 구성과 기능을 설명하고 악보·건반·소리에서 구별한다.`;
  if (/조|조표|전조|Circle|Interchange/.test(title)) return `${title}의 원리를 설명하고 조성 문맥에서 식별한다.`;
  return `${title}의 핵심 개념을 설명하고 제시된 예시에서 식별한다.`;
}

function estimateMinutes(part, bodyLength, sequenceCount) {
  let minutes = bodyLength > 7000 ? 15 : bodyLength > 4200 ? 12 : 10;
  if (sequenceCount >= 10) minutes += 3;
  if (part >= 11) minutes += 2;
  return Math.min(20, minutes);
}

function migrationLevel(part, bodyLength, sequenceCount, hasPracticeSet) {
  if (hasPracticeSet || sequenceCount >= 10 || part >= 14 || bodyLength > 8000) return '복잡';
  if (sequenceCount >= 3 || part >= 5 || bodyLength > 4000) return '보통';
  return '단순';
}

const articlePattern = /<article class="lesson" id="lesson-(\d+)-(\d+)">([\s\S]*?)<\/article>/g;
const lessons = [];
let match;

while ((match = articlePattern.exec(html)) !== null) {
  const part = Number(match[1]);
  const lesson = Number(match[2]);
  const id = `${part}-${lesson}`;
  const body = match[3];
  const titleMatch = body.match(/<h3>([\s\S]*?)<\/h3>/);
  const title = titleMatch ? stripTags(titleMatch[1]) : '(제목 없음)';
  const sequences = [...body.matchAll(/data-sequence='([^']+)'/g)].map((item) => item[1]);
  const invalidSequences = sequences.filter((value) => {
    try {
      JSON.parse(value);
      return false;
    } catch {
      return true;
    }
  });
  const errors = [];
  if (!titleMatch) errors.push('제목 없음');
  if (sequences.length === 0) errors.push('음악 데이터 없음');
  if (invalidSequences.length > 0) errors.push(`잘못된 data-sequence ${invalidSequences.length}개`);
  if (!body.includes('class="lesson-keyboard"')) errors.push('단원 건반 없음');
  if (!body.includes('class="step-play"')) errors.push('단계 재생 없음');

  const textLength = stripTags(body).length;
  const hasPracticeSet = /class="[^"]*practice-set/.test(body);
  lessons.push({
    id,
    part,
    title,
    objective: objectiveFor(id, title),
    prerequisite: partPrerequisites[part],
    minutes: estimateMinutes(part, textLength, sequences.length),
    migration: migrationLevel(part, textLength, sequences.length, hasPracticeSet),
    representative: representative.get(id) ?? '—',
    status: errors.length === 0 ? '정적 이상 없음' : errors.join(', '),
    sequenceCount: sequences.length,
  });
}

const ids = lessons.map((item) => item.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
const issueLessons = lessons.filter((item) => item.status !== '정적 이상 없음');

const lines = [
  '# Harmony RC1 단원 기준표',
  '',
  '> 생성 명령: `node scripts/audit-rc1.mjs`  ',
  '> 기준 파일: `legacy/harmony-rc1/harmony_textbook_rc1.html`  ',
  '> 생성일: 2026-08-22  ',
  '> 성격: Phase 0 이전 계획을 위한 정적 1차 기준. 화성학 내용과 브라우저 동작은 별도 검수가 필요하다.',
  '',
  '## 요약',
  '',
  `- 단원: ${lessons.length}개`,
  `- 중복 단원 ID: ${duplicateIds.length}개`,
  `- 정적 확인 필요 단원: ${issueLessons.length}개`,
  `- Engine v0.1 대표 단원: ${lessons.filter((item) => item.representative.includes('v0.1')).length}개`,
  `- Engine v0.2 스트레스 테스트: ${lessons.filter((item) => item.representative.includes('v0.2')).length}개`,
  '',
  '예상 시간은 설명·예제·연습을 한 번 수행하는 기준의 범위 추정치다. 이전 난이도는 현재 HTML을 데이터와 재사용 블록으로 옮길 때의 상대적 복잡도다.',
  '',
  '## 단원별 기준',
  '',
  '| ID | 단원 | 학습 목표 | 선수 지식 | 예상 | 이전 | 대표 여부 | 정적 상태 |',
  '|---|---|---|---|---:|---|---|---|',
  ...lessons.map((item) => `| ${item.id} | ${item.title} | ${item.objective} | ${item.prerequisite} | ${item.minutes}분 | ${item.migration} | ${item.representative} | ${item.status} |`),
  '',
  '## 정적 확인 필요 항목',
  '',
  ...(issueLessons.length
    ? issueLessons.map((item) => `- \`${item.id} ${item.title}\`: ${item.status}`)
    : ['- 없음']),
  '',
  '## 대표 단원 선택 기준',
  '',
  '- `1-2 반음과 온음`: 건반 거리 조작과 즉시 판정의 최소 수직 슬라이스',
  '- `2-3 음정의 종류`: 표기·도수·반음 수가 일치해야 하는 의미 모델 검증',
  '- `4-2 3화음`: 하나의 Chord 데이터를 악보·건반·오디오가 공유하는 구조 검증',
  '- `8-5 종지의 활용`: Progression 순차 재생과 듣기 판별 검증',
  '- `15-2 병행5도와 병행8도`: 사용자의 수정 입력과 규칙 기반 피드백 검증',
  '- `14-4 악보 분석 실습`: 복수 정답과 문맥 판단을 다루는 Engine v0.2 스트레스 테스트',
  '',
  '## 판정 범위',
  '',
  '- 이 보고서는 DOM 구조와 `data-sequence` JSON만 정적으로 확인한다.',
  '- `정적 이상 없음`은 화성학적 정확성이나 실제 재생 성공을 보장하지 않는다.',
  '- `단계 재생 없음`은 의도된 설계일 수도 있으므로 브라우저에서 UX를 확인한다.',
  '- 브라우저 회귀 검사에서 악보 렌더링, 건반 하이라이트, 오디오, 채점과 모바일 동작을 별도로 검증한다.',
  '',
];

writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote ${outputPath}`);
console.log(JSON.stringify({ lessons: lessons.length, issues: issueLessons }, null, 2));
