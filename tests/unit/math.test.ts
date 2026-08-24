import { describe, expect, it } from 'vitest';
import { evaluateLinear, formatLinear, intersectLinear, tableForLinear, validateIntersection, validateLinearParameters, validatePoint, type LinearFunction } from '../../subjects/math/src';
const line = (id: string, slope: number, intercept: number): LinearFunction => ({ id, kind: 'linear', slope, intercept });
describe('math meaning data', () => {
  it('derives values and a table from one linear function', () => { const fn = line('f', 2, 1); expect(evaluateLinear(fn, 3)).toBe(7); expect(tableForLinear(fn, [-1, 0, 1])).toEqual([{ x: -1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 3 }]); expect(formatLinear(fn)).toBe('y = 2x + 1'); });
  it('formats zero, unit, and negative coefficients', () => { expect(formatLinear(line('a', 1, 0))).toBe('y = x'); expect(formatLinear(line('b', -1, -2))).toBe('y = -x - 2'); expect(formatLinear(line('c', 0, 3))).toBe('y = 3'); });
  it('finds point, parallel, and coincident intersections', () => { expect(intersectLinear(line('a', 1, 0), line('b', -1, 2))).toEqual({ kind: 'point', point: { x: 1, y: 1 } }); expect(intersectLinear(line('a', 1, 0), line('b', 1, 2))).toEqual({ kind: 'parallel' }); expect(intersectLinear(line('a', 1, 0), line('b', 1, 0))).toEqual({ kind: 'coincident' }); });
  it('returns actionable validation feedback', () => { expect(validatePoint({ x: 2, y: 3 }, { x: 2, y: 1 }).message).toContain('x좌표는 맞습니다'); expect(validateLinearParameters(line('target', 2, 1), line('selected', 2, 0)).message).toContain('기울기는 맞습니다'); expect(validateLinearParameters(line('target', 2, 1), line('selected', 1, 1)).message).toContain('기울기를 다시 조정하세요'); expect(validateIntersection({ kind: 'point', point: { x: 1, y: 1 } }, { x: 1, y: 1 }).correct).toBe(true); });
});
