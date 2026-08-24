import { describe,expect,it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { commonBlockKinds } from '../../engine/common-blocks/src';
import { validateBook } from '../../engine/schema/src';
import { pitchName,type Pitch } from '../../subjects/music/src';

const ids=['harmony.part.analysis','harmony.part.voice-leading','harmony.part.styles'];
const lessons=harmonyBook.parts.filter((part)=>ids.includes(part.id)).flatMap((part)=>part.lessons);

describe('Harmony batch E migration',()=>{
  it('contains all PART 14-16 lessons in RC1 order',()=>{
    expect(lessons.map((lesson)=>lesson.title.split('.')[0])).toEqual(['14-1','14-2','14-3','14-4','15-1','15-2','15-3','15-4','15-5','15-6','16-1','16-2','16-3','16-4','16-5']);
    expect(lessons).toHaveLength(15);
  });
  it('gives every lesson an activity and explicit completion rule',()=>{
    for(const lesson of lessons){expect(lesson.blocks.some((block)=>block.type==='activity.subject')).toBe(true);expect(lesson.completion.type).toBe('required-blocks');}
  });
  it('keeps the representative voice-leading editor in its RC1 position',()=>{
    const item=lessons[5];expect(item.id).toBe('harmony.lesson.voice-leading');expect(item.blocks.some((block)=>block.id==='harmony.block.voice-leading.editor')).toBe(true);
  });
  it('preserves F-sharp in the applied-dominant score analysis',()=>{
    const item=lessons.find((lesson)=>lesson.id==='harmony.lesson.score-analysis-practice.lesson');
    const names=(item?.data?.[0].value as Pitch[][]).flat().map(pitchName);expect(names).toContain('F♯4');
  });
  it('completes the full 76-lesson RC1 inventory',()=>{expect(harmonyBook.parts.flatMap((part)=>part.lessons)).toHaveLength(76);});
  it('passes schema, ID, reference and block validation',()=>{expect(validateBook(harmonyBook,{supportedBlockTypes:commonBlockKinds})).toEqual([]);});
});
