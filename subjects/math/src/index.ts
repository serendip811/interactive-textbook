export const mathSubjectId = 'math' as const;

export interface Point { x: number; y: number; }
export interface Axis { min: number; max: number; step: number; label: string; }
export interface CoordinatePlane { xAxis: Axis; yAxis: Axis; }
export interface FunctionDefinition { id: string; name?: string; }
export interface LinearFunction extends FunctionDefinition { kind: 'linear'; slope: number; intercept: number; }
export interface Parameter { id: 'slope' | 'intercept' | string; label: string; value: number; min: number; max: number; step: number; }
export type Intersection = { kind: 'point'; point: Point } | { kind: 'parallel' } | { kind: 'coincident' };
export interface MathFeedback { correct: boolean; message: string; }

export function evaluateLinear(fn: LinearFunction, x: number): number { return fn.slope * x + fn.intercept; }
export function tableForLinear(fn: LinearFunction, xValues: number[]): Point[] { return xValues.map((x) => ({ x, y: evaluateLinear(fn, x) })); }
export function formatNumber(value: number): string { return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2))); }
export function formatLinear(fn: LinearFunction): string {
  const slope = fn.slope === 0 ? '' : fn.slope === 1 ? 'x' : fn.slope === -1 ? '-x' : `${formatNumber(fn.slope)}x`;
  if (fn.intercept === 0) return `y = ${slope || '0'}`;
  const sign = fn.intercept > 0 && slope ? ' + ' : fn.intercept < 0 && slope ? ' - ' : fn.intercept < 0 ? '-' : '';
  return `y = ${slope}${sign}${formatNumber(Math.abs(fn.intercept))}`;
}
export function intersectLinear(first: LinearFunction, second: LinearFunction): Intersection {
  if (first.slope === second.slope) return first.intercept === second.intercept ? { kind: 'coincident' } : { kind: 'parallel' };
  const x = (second.intercept - first.intercept) / (first.slope - second.slope);
  return { kind: 'point', point: { x, y: evaluateLinear(first, x) } };
}
export function validatePoint(target: Point, selected: Point, tolerance = 0.01): MathFeedback {
  const xMatch = Math.abs(target.x - selected.x) <= tolerance; const yMatch = Math.abs(target.y - selected.y) <= tolerance;
  if (xMatch && yMatch) return { correct: true, message: `정답입니다. 점 (${formatNumber(selected.x)}, ${formatNumber(selected.y)})을 찾았습니다.` };
  if (!xMatch && !yMatch) return { correct: false, message: `x좌표와 y좌표를 다시 확인하세요. 현재 점은 (${formatNumber(selected.x)}, ${formatNumber(selected.y)})입니다.` };
  return { correct: false, message: `${xMatch ? 'x좌표는 맞습니다. y좌표' : 'y좌표는 맞습니다. x좌표'}를 다시 확인하세요.` };
}
export function validateLinearParameters(target: LinearFunction, selected: LinearFunction): MathFeedback {
  const slopeMatch = target.slope === selected.slope; const interceptMatch = target.intercept === selected.intercept;
  if (slopeMatch && interceptMatch) return { correct: true, message: `정답입니다. ${formatLinear(selected)} 직선을 만들었습니다.` };
  if (!slopeMatch && !interceptMatch) return { correct: false, message: `기울기와 y절편을 모두 다시 확인하세요. 현재 식은 ${formatLinear(selected)}입니다.` };
  return { correct: false, message: slopeMatch ? '기울기는 맞습니다. y절편을 다시 조정하세요.' : 'y절편은 맞습니다. 기울기를 다시 조정하세요.' };
}
export function validateIntersection(expected: Intersection, selected: Point): MathFeedback {
  if (expected.kind !== 'point') return { correct: false, message: expected.kind === 'parallel' ? '두 직선은 평행하여 교점이 없습니다.' : '두 직선이 일치하여 교점이 하나로 정해지지 않습니다.' };
  return validatePoint(expected.point, selected);
}
