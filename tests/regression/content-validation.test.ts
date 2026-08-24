import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { functionsBook } from '../../books/functions/src';
import { commonBlockKinds } from '../../engine/common-blocks/src';
import { validateBook } from '../../engine/schema/src';
import { validateLinearFunctionData } from '../../subjects/math/src';
import { validateChordData, validatePitchMidiPair, type Chord } from '../../subjects/music/src';

describe('deploy-time content validation', () => {
  it.each([['harmony', harmonyBook], ['functions', functionsBook]] as const)('%s book passes schema and reference checks', (_name, book) => {
    expect(validateBook(book, { supportedBlockTypes: commonBlockKinds })).toEqual([]);
  });
  it('rejects an unknown block before deployment', () => {
    const copy = structuredClone(functionsBook);
    copy.parts[0].lessons[0].blocks[0].type = 'content.unknown';
    expect(validateBook(copy, { supportedBlockTypes: commonBlockKinds }).map((issue) => issue.code)).toContain('unsupported-block');
  });
  it('checks function parameters and graph ranges', () => {
    expect(validateLinearFunctionData({ id: 'line.ok', kind: 'linear', slope: 2, intercept: 1 }, { xAxis: { min: -5, max: 5, step: 1, label: 'x' }, yAxis: { min: -5, max: 8, step: 1, label: 'y' } })).toEqual([]);
    expect(validateLinearFunctionData({ id: 'line.bad', kind: 'linear', slope: Number.NaN, intercept: 1 })).toContain('기울기와 절편은 유한한 숫자여야 합니다.');
  });
  it('checks chord roots, bass notes and pitch spelling ranges', () => {
    const chord: Chord = { id: 'chord.c', root: { step: 'C', alter: 0, octave: 4 }, bass: { step: 'C', alter: 0, octave: 4 }, pitches: [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }] };
    expect(validateChordData(chord)).toEqual([]);
    expect(validateChordData({ ...chord, bass: { step: 'B', alter: 0, octave: 3 } })).toContain('화음 구성음에 베이스가 없습니다.');
    expect(validatePitchMidiPair({ step: 'C', alter: 0, octave: 4 }, 60)).toEqual([]);
    expect(validatePitchMidiPair({ step: 'C', alter: 0, octave: 4 }, 61)[0]).toContain('일치하지 않습니다');
  });
});
