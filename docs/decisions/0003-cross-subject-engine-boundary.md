# 0003. 두 과목 공통 엔진 경계

> 상태: 채택  
> 날짜: 2026-08-24  
> 검증 대상: 화성학 5개 대표 단원, 함수와 그래프 5개 파일럿 단원

## 결정

공통 엔진은 교재 탐색, 블록 계약, 학습 상태, 활동 완료와 평가 제출 이벤트만 책임진다. 음악의 Pitch·재생·악보·건반과 수학의 Point·LinearFunction·좌표평면·Validator는 각 과목 모듈에 둔다.

애플리케이션 조립 계층인 `apps/player`만 과목 View를 등록하고 `activity.subject`의 `subject`와 `tool`을 보고 알맞은 View로 연결한다. 따라서 새 수학 도구를 추가할 때 음악 의미 모델이나 음악 View는 수정하지 않는다.

## 두 과목에서 반복되어 공통으로 유지할 기능

| 기능 | 공통 계약 | 음악 예 | 수학 예 |
|---|---|---|---|
| 교재·단원 탐색 | `Book`, `Part`, `Lesson` | 화성학 대표 단원 | 함수와 그래프 5단원 |
| 본문·요약·평가 | 공통 Block | 개념 설명·핵심 정리 | 개념 설명·핵심 정리 |
| 조작 활동 슬롯 | `activity.subject` | 화음·성부진행 | 점·직선·교점 |
| 완료 결과 | `{ response, correct, attempts }` | 선택한 음 | 좌표·함수 계수 |
| 학습 상태 | `BookProgress` | 음악 Activity 진도 | 수학 Activity 진도 |
| 이벤트 | `activity.completed` | 재생 여부와 무관한 완료 | 재생 기능 없는 완료 |

## 과목마다 다르게 유지할 기능

| 음악 전용 | 수학 전용 |
|---|---|
| Pitch·Interval·Chord 의미 데이터 | Point·LinearFunction·Intersection 의미 데이터 |
| 악보·건반 View | 좌표평면·함수표 View |
| Web Audio 재생과 재생 세션 | 계수·좌표 슬라이더 |
| 음정·화음·성부진행 Validator | 점·직선·교점 Validator |

## 자동 검증

- `tests/unit/architecture-boundary.test.ts`: 공통 엔진이 음악·수학 과목 패키지를 import하지 않는지 검사한다.
- `tests/unit/contracts.test.ts`: 동일한 도구 등록 계약에 음악과 수학을 함께 등록하고, 공통 이벤트 이름을 검사한다.
- `tests/unit/learning-state.test.ts`: 수학 좌표 응답이 과목 전용 상태 타입 없이 저장·복원되는지 검사한다.
- `tests/integration/player.test.ts`: 두 교재를 동일한 데이터 기반 플레이어 API로 탐색한다.

## 결과

두 번째 과목을 추가하며 공통 엔진 패키지에 음악 또는 수학 타입을 추가하지 않았다. 재생은 음악 과목의 선택 기능이며 수학 Activity 완료 조건에는 필요하지 않다.
