import { schemaVersion, type Book } from '@interactive-textbook/schema';
import type { CoordinatePlane, LinearFunction } from '@interactive-textbook/subject-math';

export const functionsBookId = 'functions-and-graphs' as const;
const plane: CoordinatePlane = { xAxis: { min: -5, max: 5, step: 1, label: 'x' }, yAxis: { min: -5, max: 5, step: 1, label: 'y' } };
const line = (id: string, slope: number, intercept: number): LinearFunction => ({ id, kind: 'linear', slope, intercept });

export const functionsBook: Book = {
  id: functionsBookId, schemaVersion, contentVersion: '0.1.0', engineVersion: '0.1.0', subject: 'math', title: '함수와 그래프', description: '값을 바꾸며 수식·표·그래프의 연결을 이해하는 미니 교재', language: 'ko-KR',
  parts: [{ id: 'functions.part.foundations', title: 'PART 1. 함수와 그래프', lessons: [{
    id: 'functions.lesson.coordinates', title: '1. 좌표와 점', summary: 'x좌표와 y좌표를 사용해 점의 위치를 나타냅니다.', estimatedMinutes: 10,
    objectives: [{ id: 'functions.objective.coordinates', title: '좌표 (x, y)를 읽고 좌표평면에 점을 배치한다.' }],
    blocks: [
      { id: 'functions.block.coordinates.concept', type: 'content.markdown', objectiveRefs: ['functions.objective.coordinates'], data: { markdown: '좌표 **(x, y)**는 가로 위치 x를 먼저, 세로 위치 y를 나중에 읽습니다. 양수와 음수의 방향을 확인해 점의 위치를 찾습니다.' } },
      { id: 'functions.block.coordinates.plotter', type: 'activity.subject', objectiveRefs: ['functions.objective.coordinates'], data: { subject: 'math', tool: 'point-plotter', title: '점 (2, 3) 배치하기', input: { plane, targetPoint: { x: 2, y: 3 }, initialPoint: { x: 0, y: 0 } } } },
      { id: 'functions.block.coordinates.summary', type: 'content.summary', objectiveRefs: ['functions.objective.coordinates'], data: { items: ['x좌표는 가로 위치입니다.', 'y좌표는 세로 위치입니다.', '좌표는 항상 (x, y) 순서로 씁니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['functions.block.coordinates.plotter'] },
  }, {
    id: 'functions.lesson.input-output', title: '2. 함수의 입력과 출력', summary: '입력값을 바꾸며 함수 규칙과 출력값의 관계를 확인합니다.', estimatedMinutes: 10, prerequisiteRefs: ['functions.lesson.coordinates'],
    objectives: [{ id: 'functions.objective.input-output', title: '함수 규칙에 입력값을 넣어 출력값을 구한다.' }],
    blocks: [
      { id: 'functions.block.input-output.concept', type: 'content.markdown', objectiveRefs: ['functions.objective.input-output'], data: { markdown: '함수는 입력값을 하나 넣으면 정해진 규칙에 따라 출력값 하나를 만듭니다. 여기서는 **y = 2x + 1** 규칙을 사용합니다.' } },
      { id: 'functions.block.input-output.machine', type: 'activity.subject', objectiveRefs: ['functions.objective.input-output'], data: { subject: 'math', tool: 'function-machine', title: '출력 7을 만드는 입력 찾기', input: { plane, fn: line('math.function.input-output', 2, 1), targetOutput: 7 } } },
      { id: 'functions.block.input-output.summary', type: 'content.summary', objectiveRefs: ['functions.objective.input-output'], data: { items: ['입력 x가 정해지면 출력 y가 정해집니다.', '수식·표·그래프는 같은 함수 규칙을 표현합니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['functions.block.input-output.machine'] },
  }, {
    id: 'functions.lesson.slope', title: '3. 일차함수의 기울기', summary: '기울기를 바꾸며 직선의 방향과 가파르기를 비교합니다.', estimatedMinutes: 12, prerequisiteRefs: ['functions.lesson.input-output'],
    objectives: [{ id: 'functions.objective.slope', title: '기울기의 부호와 크기가 직선에 미치는 영향을 설명한다.' }],
    blocks: [
      { id: 'functions.block.slope.concept', type: 'content.markdown', objectiveRefs: ['functions.objective.slope'], data: { markdown: '**y = ax + b**에서 a는 기울기입니다. a가 양수면 오른쪽으로 갈수록 올라가고, 음수면 내려갑니다. 절댓값이 클수록 더 가파릅니다.' } },
      { id: 'functions.block.slope.builder', type: 'activity.subject', objectiveRefs: ['functions.objective.slope'], data: { subject: 'math', tool: 'line-builder', title: '기울기 2인 직선 만들기', input: { plane, initial: line('math.line.slope-current', 0, 1), target: line('math.line.slope-target', 2, 1), adjustable: ['slope'] } } },
      { id: 'functions.block.slope.summary', type: 'content.summary', objectiveRefs: ['functions.objective.slope'], data: { items: ['기울기 a는 직선의 방향과 가파르기를 정합니다.', 'y절편이 같아도 기울기가 다르면 직선의 방향이 달라집니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['functions.block.slope.builder'] },
  }, {
    id: 'functions.lesson.intercept', title: '4. 절편의 변화', summary: '기울기를 유지하고 y절편만 바꾸어 직선을 평행 이동합니다.', estimatedMinutes: 10, prerequisiteRefs: ['functions.lesson.slope'],
    objectives: [{ id: 'functions.objective.intercept', title: 'y절편과 직선의 평행 이동을 연결한다.' }],
    blocks: [
      { id: 'functions.block.intercept.concept', type: 'content.markdown', objectiveRefs: ['functions.objective.intercept'], data: { markdown: '**y = ax + b**에서 b는 y절편입니다. 기울기 a를 그대로 두고 b만 바꾸면 직선은 기울어진 모양을 유지한 채 위아래로 이동합니다.' } },
      { id: 'functions.block.intercept.builder', type: 'activity.subject', objectiveRefs: ['functions.objective.intercept'], data: { subject: 'math', tool: 'line-builder', title: 'y절편이 -2인 직선 만들기', input: { plane, initial: line('math.line.intercept-current', 1, 2), target: line('math.line.intercept-target', 1, -2), adjustable: ['intercept'] } } },
      { id: 'functions.block.intercept.summary', type: 'content.summary', objectiveRefs: ['functions.objective.intercept'], data: { items: ['y절편 b는 직선이 y축과 만나는 값입니다.', '기울기가 같고 절편만 다르면 두 직선은 평행합니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['functions.block.intercept.builder'] },
  }, {
    id: 'functions.lesson.intersection', title: '5. 두 직선의 교점', summary: '두 직선이 만나는 점을 그래프와 두 함수식에서 함께 확인합니다.', estimatedMinutes: 12, prerequisiteRefs: ['functions.lesson.intercept'],
    objectives: [{ id: 'functions.objective.intersection', title: '두 직선의 교점을 찾고 두 식을 동시에 만족함을 확인한다.' }],
    blocks: [
      { id: 'functions.block.intersection.concept', type: 'content.markdown', objectiveRefs: ['functions.objective.intersection'], data: { markdown: '두 직선의 **교점**은 두 함수식의 출력값이 같은 점입니다. 교점의 x와 y를 두 식에 넣으면 모두 성립합니다.' } },
      { id: 'functions.block.intersection.finder', type: 'activity.subject', objectiveRefs: ['functions.objective.intersection'], data: { subject: 'math', tool: 'intersection-finder', title: '두 직선의 교점 찾기', input: { plane, initialPoint: { x: 0, y: 0 }, lines: [line('math.line.intersection-a', 1, 0), line('math.line.intersection-b', -1, 2)] } } },
      { id: 'functions.block.intersection.summary', type: 'content.summary', objectiveRefs: ['functions.objective.intersection'], data: { items: ['교점은 두 직선 위에 동시에 있는 점입니다.', '교점 좌표는 두 함수식에 넣었을 때 같은 y값을 만듭니다.'] } },
    ], completion: { type: 'required-blocks', blockRefs: ['functions.block.intersection.finder'] },
  }] }],
};
