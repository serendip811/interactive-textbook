import { useMemo, useState } from 'react';
import { evaluateLinear, formatLinear, formatNumber, intersectLinear, tableForLinear, validateIntersection, validateLinearParameters, validatePoint, type CoordinatePlane, type LinearFunction, type Point } from '@interactive-textbook/subject-math';

const defaultPlane: CoordinatePlane = { xAxis: { min: -5, max: 5, step: 1, label: 'x' }, yAxis: { min: -5, max: 5, step: 1, label: 'y' } };
interface Input { plane?: CoordinatePlane; targetPoint?: Point; initialPoint?: Point; fn?: LinearFunction; lines?: LinearFunction[]; target?: LinearFunction; initial?: LinearFunction; xValues?: number[]; targetOutput?: number; adjustable?: Array<'slope' | 'intercept'>; }
interface Props { tool: string; title: string; input: Input; onComplete?: (result: unknown) => void; }

function CoordinateGraph({ plane = defaultPlane, points = [], lines = [] }: { plane?: CoordinatePlane; points?: Array<{ point: Point; label?: string; target?: boolean }>; lines?: LinearFunction[] }) {
  const width = 420; const height = 300; const pad = 34;
  const sx = (x: number) => pad + (x - plane.xAxis.min) / (plane.xAxis.max - plane.xAxis.min) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - plane.yAxis.min) / (plane.yAxis.max - plane.yAxis.min) * (height - pad * 2);
  const xTicks = Array.from({ length: Math.floor((plane.xAxis.max - plane.xAxis.min) / plane.xAxis.step) + 1 }, (_, i) => plane.xAxis.min + i * plane.xAxis.step);
  const yTicks = Array.from({ length: Math.floor((plane.yAxis.max - plane.yAxis.min) / plane.yAxis.step) + 1 }, (_, i) => plane.yAxis.min + i * plane.yAxis.step);
  const description = [...lines.map(formatLinear), ...points.map(({ point, label }) => `${label ?? '점'} (${formatNumber(point.x)}, ${formatNumber(point.y)})`)].join(', ');
  return <svg className="coordinate-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`좌표평면: ${description || '표시된 데이터 없음'}`}>
    {xTicks.map((x) => <g key={`x-${x}`}><line className="grid" x1={sx(x)} x2={sx(x)} y1={pad} y2={height - pad} />{x !== 0 && <text x={sx(x)} y={sy(0) + 18} textAnchor="middle">{x}</text>}</g>)}
    {yTicks.map((y) => <g key={`y-${y}`}><line className="grid" x1={pad} x2={width - pad} y1={sy(y)} y2={sy(y)} />{y !== 0 && <text x={sx(0) - 9} y={sy(y) + 4} textAnchor="end">{y}</text>}</g>)}
    <line className="axis" x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} /><line className="axis" x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} />
    {lines.map((line, index) => <line key={line.id} className={`math-line line-${index + 1}`} x1={sx(plane.xAxis.min)} y1={sy(evaluateLinear(line, plane.xAxis.min))} x2={sx(plane.xAxis.max)} y2={sy(evaluateLinear(line, plane.xAxis.max))} />)}
    {points.map(({ point, label, target }) => <g key={`${label}-${point.x}-${point.y}`}><circle className={target ? 'graph-point target' : 'graph-point'} cx={sx(point.x)} cy={sy(point.y)} r="7" /><text className="point-label" x={sx(point.x) + 10} y={sy(point.y) - 10}>{label}</text></g>)}
  </svg>;
}
function FunctionRepresentations({ fn, plane = defaultPlane, activeX }: { fn: LinearFunction; plane?: CoordinatePlane; activeX?: number }) {
  const xValues = [-2, -1, 0, 1, 2]; const table = tableForLinear(fn, xValues); const activePoint = activeX === undefined ? [] : [{ point: { x: activeX, y: evaluateLinear(fn, activeX) }, label: '현재' }];
  return <div className="function-representations"><p className="equation">{formatLinear(fn)}</p><CoordinateGraph plane={plane} lines={[fn]} points={activePoint} /><div className="value-table-wrap"><table className="value-table"><caption>입력과 출력 표</caption><thead><tr><th>x</th>{table.map((point) => <th key={point.x}>{formatNumber(point.x)}</th>)}</tr></thead><tbody><tr><th>y</th>{table.map((point) => <td key={point.x}>{formatNumber(point.y)}</td>)}</tr></tbody></table></div></div>;
}
function RangeControl({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) { return <label className="math-control"><span>{label}: <strong>{formatNumber(value)}</strong></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>; }

export function MathActivity({ tool, title, input, onComplete }: Props) {
  const plane = input.plane ?? defaultPlane; const [attempts, setAttempts] = useState(0); const [feedback, setFeedback] = useState('');
  const [point, setPoint] = useState<Point>(input.initialPoint ?? { x: 0, y: 0 }); const [x, setX] = useState(0);
  const [line, setLine] = useState<LinearFunction>(input.initial ?? input.fn ?? { id: 'math.line.current', kind: 'linear', slope: 1, intercept: 0 });
  const intersection = useMemo(() => input.lines?.length === 2 ? intersectLinear(input.lines[0], input.lines[1]) : undefined, [input.lines]);
  const submit = (result: { correct: boolean; message: string }, response: unknown) => { const count = attempts + 1; setAttempts(count); setFeedback(result.message); if (result.correct) onComplete?.({ response, correct: true, attempts: count }); };
  const controls = (input.adjustable ?? ['slope', 'intercept']);
  return <section className="math-activity" aria-label={`${title} 활동`}><p className="section-label">MATH · {tool}</p><h2>{title}</h2>
    {tool === 'point-plotter' && <><CoordinateGraph plane={plane} points={[{ point, label: '선택' }]} /><div className="math-controls"><RangeControl label="x좌표" value={point.x} min={plane.xAxis.min} max={plane.xAxis.max} onChange={(value) => { setPoint((current) => ({ ...current, x: value })); setFeedback(''); }} /><RangeControl label="y좌표" value={point.y} min={plane.yAxis.min} max={plane.yAxis.max} onChange={(value) => { setPoint((current) => ({ ...current, y: value })); setFeedback(''); }} /></div><button className="math-submit" onClick={() => submit(validatePoint(input.targetPoint ?? { x: 0, y: 0 }, point), point)}>점 확인</button></>}
    {tool === 'function-machine' && input.fn && <><FunctionRepresentations fn={input.fn} plane={plane} activeX={x} /><RangeControl label="입력 x" value={x} min={plane.xAxis.min} max={plane.xAxis.max} onChange={(value) => { setX(value); setFeedback(''); }} /><p className="output-card">입력 {formatNumber(x)} → 출력 <strong>{formatNumber(evaluateLinear(input.fn, x))}</strong></p><button className="math-submit" onClick={() => { const output = evaluateLinear(input.fn!, x); submit({ correct: output === input.targetOutput, message: output === input.targetOutput ? `정답입니다. x=${formatNumber(x)}일 때 출력은 ${formatNumber(output)}입니다.` : `현재 출력은 ${formatNumber(output)}입니다. 목표 출력 ${formatNumber(input.targetOutput ?? 0)}과 비교하세요.` }, { x, output }); }}>입력 확인</button></>}
    {tool === 'line-builder' && input.target && <><FunctionRepresentations fn={line} plane={plane} /> <div className="math-controls">{controls.includes('slope') && <RangeControl label="기울기 a" value={line.slope} min={-3} max={3} onChange={(value) => { setLine((current) => ({ ...current, slope: value })); setFeedback(''); }} />}{controls.includes('intercept') && <RangeControl label="y절편 b" value={line.intercept} min={-4} max={4} onChange={(value) => { setLine((current) => ({ ...current, intercept: value })); setFeedback(''); }} />}</div><p className="target-equation">목표: <strong>{formatLinear(input.target)}</strong></p><button className="math-submit" onClick={() => submit(validateLinearParameters(input.target!, line), line)}>직선 확인</button></>}
    {tool === 'intersection-finder' && input.lines?.length === 2 && intersection && <><CoordinateGraph plane={plane} lines={input.lines} points={[{ point, label: '선택' }]} /><div className="line-legend"><span>{formatLinear(input.lines[0])}</span><span>{formatLinear(input.lines[1])}</span></div><div className="math-controls"><RangeControl label="교점 x" value={point.x} min={plane.xAxis.min} max={plane.xAxis.max} onChange={(value) => { setPoint((current) => ({ ...current, x: value })); setFeedback(''); }} /><RangeControl label="교점 y" value={point.y} min={plane.yAxis.min} max={plane.yAxis.max} onChange={(value) => { setPoint((current) => ({ ...current, y: value })); setFeedback(''); }} /></div><button className="math-submit" onClick={() => submit(validateIntersection(intersection, point), point)}>교점 확인</button></>}
    <p className={feedback.startsWith('정답') ? 'play-status feedback--success' : 'play-status'} aria-live="polite">{feedback}</p>
  </section>;
}
