import { engineAreas } from '@interactive-textbook/engine-player';
import { commonBlockKinds } from '@interactive-textbook/common-blocks';
import { schemaVersion } from '@interactive-textbook/schema';

export function App() {
  return (
    <main className="shell">
      <p className="eyebrow">ENGINE V0.1 · PHASE 1</p>
      <h1>Interactive Textbook Player</h1>
      <p className="lede">
        화성학 RC1에서 검증한 학습 경험을 데이터 중심 교재 엔진으로 분리합니다.
      </p>

      <section aria-labelledby="foundation-title" className="panel">
        <div>
          <p className="section-label">FOUNDATION</p>
          <h2 id="foundation-title">프로젝트 골격 준비 완료</h2>
        </div>
        <dl className="facts">
          <div>
            <dt>Schema</dt>
            <dd>{schemaVersion}</dd>
          </div>
          <div>
            <dt>Engine areas</dt>
            <dd>{engineAreas.length}</dd>
          </div>
          <div>
            <dt>Common blocks</dt>
            <dd>{commonBlockKinds.length}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
