# Schema changelog

## 0.2.0 — 2026-08-24

- 모든 블록에 `blockVersion: 1.0.0`을 필수로 추가
- 콘텐츠·엔진 버전을 SemVer로 제한
- ID, 중복, 참조, 지원 블록, 객관식 정답, 활동 제목 검증 추가
- `migrateBookFrom010` 단방향 마이그레이션 추가
- 필수·선택 필드와 참조 범위를 ADR 0004로 확정

## 0.1.0

- Book, Part, Lesson, Objective, DataReference, Block의 최초 계약
