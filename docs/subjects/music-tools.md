# 음악 과목 도구 v0.1

음악 도구는 `activity.subject` 블록의 `data.subject: music`과 `data.tool`로 선택한다. 공통 엔진은 `Pitch`, `Chord`, `Progression`, `VoiceLeading`을 직접 참조하지 않는다.

| tool | 의미 데이터 | 학습자 행동 | 완료 신호 |
|---|---|---|---|
| `pitch-pair-viewer` | `Pitch[][]` | 예제 전환·듣기 | 관찰용 |
| `semitone-explorer` | `Pitch[]` | 두 음 선택 | 반음·온음 판정 성공 |
| `interval-builder` | 기준 `Pitch`, 목표 도수·성질 | 도착음 선택 | 목표 음정 일치 |
| `chord-builder` | 목표 `Pitch[]` | 구성음 세 개 선택 | 빠진·추가 음 없음 |
| `progression-player` | `Progression[]` | 전체·단계 듣기 | 관찰용 |
| `cadence-listener` | `CadenceProgression[]` | 종지 유형 선택 | 유형 일치 |
| `voice-leading-editor` | `VoiceLeading` | 한 성부 도착음 수정 | 병행5도·8도 없음 |

## 공통화 기준

- 악보와 건반 View는 음정·화음·종지·성부진행에서 반복되어 공유한다.
- 재생 세션 중단은 모든 음악 Activity가 필요하므로 엔진의 과목 중립적 `PlaybackSessionController`를 사용한다.
- 반음, 음정, 화음, 종지, 성부진행 판정은 음악 의미를 가지므로 `subjects/music`에 유지한다.
- `ProgressionActivity`와 `VoiceLeadingActivity`는 한 종류의 단원에서만 사용되므로 아직 공통 Activity로 승격하지 않는다.

## 콘텐츠 연결 예

```ts
{
  type: 'activity.subject',
  data: {
    subject: 'music',
    tool: 'interval-builder',
    title: 'C4에서 완전5도 만들기',
    input: { initial: [C4], target: { degree: 5, quality: 'perfect' } }
  }
}
```
