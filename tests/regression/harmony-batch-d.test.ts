import { describe, expect, it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { commonBlockKinds } from '../../engine/common-blocks/src';
import { validateBook } from '../../engine/schema/src';
import { pitchName, type Pitch } from '../../subjects/music/src';

const ids=['harmony.part.nonchord-tones','harmony.part.applied-chords','harmony.part.chromatic-harmony','harmony.part.modulation'];
const lessons=harmonyBook.parts.filter((part)=>ids.includes(part.id)).flatMap((part)=>part.lessons);

describe('Harmony batch D migration',()=>{
  it('contains all PART 10-13 lessons in RC1 order',()=>{
    expect(lessons.map((lesson)=>lesson.title.split('.')[0])).toEqual(['10-1','10-2','10-3','10-4','10-5','10-6','11-1','11-2','11-3','12-1','12-2','12-3','13-1','13-2','13-3','13-4','13-5']);
    expect(lessons).toHaveLength(17);
  });
  it('gives every lesson meaning data, an activity and completion',()=>{
    for(const lesson of lessons){expect(lesson.data?.length).toBeGreaterThan(0);expect(lesson.blocks.some((block)=>block.type==='activity.subject')).toBe(true);expect(lesson.completion.type).toBe('required-blocks');}
  });
  it('preserves the chromatic tones that create V/ii and vii degree/ii',()=>{
    const applied=lessons.filter((lesson)=>['harmony.lesson.secondary-dominant.lesson','harmony.lesson.secondary-leading-tone.lesson'].includes(lesson.id));
    const names=applied.flatMap((lesson)=>((lesson.data?.[0].value as Pitch[][]).flat().map(pitchName)));
    expect(names).toContain('C♯5'); expect(names).toContain('C♯4');
  });
  it('keeps the augmented-sixth tendency tones A-flat and F-sharp',()=>{
    const item=lessons.find((lesson)=>lesson.id==='harmony.lesson.augmented-sixth.lesson');
    const names=(item?.data?.[0].value as Pitch[][])[0].map(pitchName);
    expect(names).toEqual(['A♭4','C5','F♯5']);
  });
  it('passes schema, ID, reference and block validation',()=>{expect(validateBook(harmonyBook,{supportedBlockTypes:commonBlockKinds})).toEqual([]);});
});
