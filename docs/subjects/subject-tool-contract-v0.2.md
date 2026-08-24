# Subject Tool 계약 v0.2

과목 도구는 공통 엔진을 수정하지 않고 `subject + tool` 키로 등록한다. 플레이어의 `subjectActivityRegistry`가 View를 연결하고, 엔진의 `SubjectToolRegistry`가 입력 검증·실행·접근성 설명 같은 런타임 계약을 관리한다.

## 등록 계약

```ts
registry.register({
  subject: 'science',
  kind: 'vector-builder',
  version: '1.0.0',
  engineVersion: '0.2.0',
  validateInput: isVectorInput,
  run: (input) => calculateVector(input),
  accessibleSummary: (input) => `크기 ${input.magnitude}, 방향 ${input.angle}도`,
});
```

- 키는 `subject:kind`이며 중복 등록은 오류다.
- 입력은 과목 패키지에서 타입 가드 또는 스키마로 검증한다.
- View는 앱 계층에서 같은 키로 등록한다. 공통 엔진은 React와 과목 패키지를 참조하지 않는다.
- Activity 상태는 `response`, `correct`, `attempts`를 포함한 JSON 직렬화 가능 값으로 저장한다.
- Validator는 과목 패키지가 소유하고 공통 `ValidationResult` 형태로 결과를 반환한다.
- 완료 조건은 교재의 `completion`이 블록 ID를 참조하며, View 내부 상태와 분리한다.
- 모든 View는 제목, 상태 변화용 `aria-live`, 비시각적 데이터 요약 또는 동등한 대체 표현을 제공한다.
- 도구 버전과 요구 엔진 버전은 SemVer로 선언한다.

## 공통 이벤트

- `activity.completed`
- `assessment.submitted`
- `playback.started`, `playback.paused`, `playback.stopped`

이벤트 이름에는 음악·수학 용어를 넣지 않는다. 과목별 세부 결과는 payload 또는 학습 상태에 둔다.

## 새 과목 추가 순서

1. `subjects/<subject>`에 의미 데이터와 Validator를 만든다.
2. `activity.subject`의 `subject`, `tool`, `title`, `input`을 정의한다.
3. 입력 타입 가드와 접근성 요약을 `SubjectToolRegistry`에 등록한다.
4. 앱에서 View를 `registerSubjectActivity`로 등록한다.
5. 정상 입력, 잘못된 입력, 저장·복원, 키보드 조작 테스트를 추가한다.
6. 두 단원 이상에서 반복된 UI만 공통 블록으로 승격한다.
