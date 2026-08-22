# ADR 0001: Phase 1 기술 스택과 저장소 구조

> 상태: 채택  
> 결정일: 2026-08-22

## 결정

- 언어: TypeScript strict mode
- UI: React 19
- 개발·빌드: Vite
- 패키지 관리: pnpm workspace
- 단위·통합 테스트: Vitest
- RC1 회귀 테스트: Node 내장 test runner 유지
- 코드 품질: ESLint flat config와 Prettier
- CI: GitHub Actions에서 lint, typecheck, test, build 실행

## 구조

- `apps/player`: 학습 실행기
- `engine/schema`: 과목 독립 콘텐츠 계약
- `engine/player`: 로딩·탐색·렌더링·이벤트 조정
- `engine/common-blocks`: 과목 독립 공통 블록
- `engine/learning-state`: 저장소 계약과 학습 상태
- `subjects/music`: 음악 의미 모델과 도구
- `subjects/math`: 함수와 그래프 확장 위치
- `books/harmony`: 화성학 콘텐츠
- `books/functions`: 두 번째 교재 확장 위치

공통 엔진은 `subjects/music`을 참조하지 않는다. 과목별 기능은 등록 계약을 통해 플레이어와 연결한다.

## 이유

React와 Vite는 작은 플레이어를 빠르게 실행하면서도 블록 레지스트리와 Activity 상태를 컴포넌트 단위로 분리하기 적합하다. pnpm workspace는 앱·엔진·과목·교재의 의존 방향을 하나의 저장소에서 명시할 수 있다. TypeScript와 Vitest는 의미 데이터와 UI 사이 계약을 실행 전에 검증하는 기반이 된다.

## 설치 제한 기록

초기 구조를 만든 실행 환경에서는 공개 패키지 레지스트리 접근이 허용되지 않아 로컬 의존성 설치를 수행하지 못했다. 저장소 CI가 동일한 명령으로 설치와 전체 검증을 수행한다.
