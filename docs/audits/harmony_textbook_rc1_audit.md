# Harmony Textbook RC1 검증 보고서

- 기준 파일: `harmony_textbook_part2_with_global_piano.html`
- 구조화된 `data-sequence` 파싱 확인: **471개**
- 규칙 기반 이론 검증: **18개 통과 / 18개 검사**
- 서술 정확성 보정: 가락단음계, 토닉 대리, 변격종지, 이탈음/도약진행음, 4성부 간격, 병행5·8도
- PART 3~16: 파트별 4문항 체크포인트 추가
- 악보: 기존 수제 SVG를 VexFlow 4.2.2 SVG 렌더링으로 재렌더하며, 로드 실패 시 기존 SVG가 fallback

## 규칙 기반 검증

- ✅ **3-1 C major scale** — 온온반온온온반
- ✅ **3-2 A harmonic minor** — A 화성단음계
- ✅ **3-3 G major scale** — F# 포함
- ✅ **4-2 triad qualities** — 장/단/감/증 3화음
- ✅ **4-3 C triad inversions** — 기본형/1전위/2전위
- ✅ **5-2 seventh qualities** — Cmaj7/Cm7/C7
- ✅ **5-3 G7 inversions** — G7 전위
- ✅ **5-4 V7-I** — G7→C
- ✅ **6-1 major diatonic triads** — I ii iii IV V vi vii°
- ✅ **8-1 authentic cadence** — V→I
- ✅ **8-2 half cadence** — V에서 정지
- ✅ **8-3 plagal cadence** — IV→I
- ✅ **8-4 deceptive cadence** — V→vi
- ✅ **11-1 V/V** — D7→G
- ✅ **11-2 vii°/V** — F#dim→G
- ✅ **12-2 Neapolitan 6** — Bb/D first inversion
- ✅ **12-3 Ger+6 sonority** — F-A-C-D# in A minor
- ✅ **15-2 parallel fifth example** — C-G→D-A

## 남은 한계

- 고급 분석(차용·전조·낭만화성·대중음악)은 문맥에 따라 복수 해석이 가능하므로 자동 정답 판정보다 보수적 설명과 체크포인트로 검수함.
- 4성부 실제 작법 문제는 아직 자동 voice-leading checker를 붙이지 않았음.
- VexFlow는 CDN을 사용하므로 최초 로딩에는 인터넷 연결이 필요함.
