import { describe, expect, it } from 'vitest';
import { functionsBook } from '../../books/functions/src';
import { validateBookIdentity } from '../../engine/schema/src';
describe('functions and graphs pilot book', () => {
  it('contains the five scoped lessons with unique valid IDs', () => { expect(functionsBook.parts[0].lessons.map((lesson) => lesson.id)).toEqual(['functions.lesson.coordinates', 'functions.lesson.input-output', 'functions.lesson.slope', 'functions.lesson.intercept', 'functions.lesson.intersection']); expect(validateBookIdentity(functionsBook)).toEqual([]); });
  it('uses math tools without music data', () => { const activities = functionsBook.parts.flatMap((part) => part.lessons).flatMap((lesson) => lesson.blocks).filter((block) => block.type === 'activity.subject'); expect(activities).toHaveLength(5); expect(activities.every((block) => (block.data as { subject: string }).subject === 'math')).toBe(true); expect(JSON.stringify(functionsBook)).not.toContain('subject":"music'); });
  it('defines an explicit completion activity for every lesson', () => { for (const lesson of functionsBook.parts[0].lessons) { expect(lesson.completion.type).toBe('required-blocks'); if (lesson.completion.type === 'required-blocks') expect(lesson.completion.blockRefs).toHaveLength(1); } });
  it('keeps the target output visible and represented in the function table', () => {
    const lesson = functionsBook.parts[0].lessons.find((item) => item.id === 'functions.lesson.input-output');
    const activity = lesson?.blocks.find((block) => block.id === 'functions.block.input-output.machine');
    const input = (activity?.data as { input: { plane: { yAxis: { max: number } }; xValues: number[]; targetOutput: number } }).input;
    expect(input.plane.yAxis.max).toBeGreaterThanOrEqual(input.targetOutput);
    expect(input.xValues).toContain(3);
  });
});
