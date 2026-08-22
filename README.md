# Interactive Textbook

화성학에서 검증한 **개념을 직접 보고·듣고·조작하며 이해하는 학습 경험**을 재사용 가능한 교재 엔진으로 만들고, 서로 다른 두 번째 교재에서 검증한 뒤 플랫폼으로 확장하는 프로젝트입니다.

현재 단계는 **Phase 0 — Harmony RC1 기준화**입니다.

## 현재 기준

- 제품·개발 방향의 Source of Truth: [`docs/v0.2.md`](docs/v0.2.md)
- 실행 순서와 진행 상태: [`TODO.md`](TODO.md)
- 기준 구현체: [`legacy/harmony-rc1/harmony_textbook_rc1.html`](legacy/harmony-rc1/harmony_textbook_rc1.html)
- RC1 정적 감사 기록: [`docs/audits/harmony_textbook_rc1_audit.md`](docs/audits/harmony_textbook_rc1_audit.md)

## RC1 실행

저장소 루트에서 정적 서버를 실행합니다.

```bash
python3 -m http.server 8000
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:8000/legacy/harmony-rc1/harmony_textbook_rc1.html
```

오디오는 브라우저 정책상 사용자가 듣기 버튼이나 건반을 직접 누른 뒤 활성화됩니다. 악보 렌더링은 VexFlow 4.2.2를 jsDelivr CDN에서 불러오므로 처음 실행할 때 인터넷 연결이 필요합니다.

## RC1 관리 원칙

RC1은 새 엔진의 비교·회귀 기준으로 동결합니다.

허용하는 변경:

- 명백한 화성학 오류
- 악보·건반·오디오 불일치
- 기존 기능의 버그
- 모바일 화면 깨짐
- 치명적인 접근성 또는 성능 문제

최소화하는 변경:

- 진도 저장 등 플랫폼 기능 추가
- 새 블록 시스템 도입
- 회원·계정 기능 추가
- 대규모 UI 개편
- 다른 과목 추가

구조 변경과 신규 기능은 RC1이 아니라 이후 교재 엔진에서 진행합니다.

## RC1 검사

Node 내장 테스트 러너만 사용하므로 별도 패키지 설치가 필요하지 않습니다.

```bash
node --test tests/harmony-rc1-static.test.mjs
```

단원 기준표를 다시 생성하려면 다음 명령을 실행합니다.

```bash
node scripts/audit-rc1.mjs
```

수동 브라우저 검사 절차와 합격 기준은 [`docs/testing/harmony-rc1-regression-plan.md`](docs/testing/harmony-rc1-regression-plan.md)를 따릅니다.

## 문서 구조

```text
.
├── README.md
├── TODO.md
├── docs/
│   ├── v0.2.md
│   ├── archive/
│   │   ├── v0.1-file.md
│   │   ├── v0.1-notebook.md
│   │   └── v0.1-platform.md
│   └── audits/
│       └── harmony_textbook_rc1_audit.md
└── legacy/
    └── harmony-rc1/
        └── harmony_textbook_rc1.html
```

## 문서 역할

- `docs/v0.2.md`: 현재 무엇을 만들고 무엇을 먼저 만들지 결정합니다.
- `docs/archive/v0.1-platform.md`: 장기 제품·기술 아키텍처를 참고합니다.
- `docs/archive/v0.1-notebook.md`: 실험, 실패, 아이디어와 결정 근거를 보존합니다.
- `docs/archive/v0.1-file.md`: v0.2 이전 제품 기획 기준을 보존합니다.
- `TODO.md`: 단계별 작업과 통과 조건을 추적합니다.

## 다음 작업

`TODO.md`의 `NOW — Phase 0` 항목을 위에서부터 진행합니다. Phase 0의 통과 조건을 만족한 뒤에만 Engine v0.1 구현으로 넘어갑니다.
