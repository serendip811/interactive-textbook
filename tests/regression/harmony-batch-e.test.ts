import { describe,expect,it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';
import { commonBlockKinds } from '../../engine/common-blocks/src';
import { validateBook } from '../../engine/schema/src';
import { pitchName,pitchToMidi,type Pitch } from '../../subjects/music/src';

const ids=['harmony.part.analysis','harmony.part.voice-leading','harmony.part.styles'];
const lessons=harmonyBook.parts.filter((part)=>ids.includes(part.id)).flatMap((part)=>part.lessons);
const lessonById=(id:string)=>lessons.find((lesson)=>lesson.id===id);
const groupNames=(id:string)=>(lessonById(id)?.data?.[0].value as Pitch[][]).map((group)=>group.map(pitchName));
const directPerfectParallels=(groups:Pitch[][])=>groups.slice(0,-1).flatMap((group,index)=>{
  const next=groups[index+1];
  return group.flatMap((firstPitch,firstVoice)=>group.slice(firstVoice+1).flatMap((secondPitch,offset)=>{
    const secondVoice=firstVoice+offset+1;
    const firstMotion=pitchToMidi(next[firstVoice])-pitchToMidi(firstPitch);
    const secondMotion=pitchToMidi(next[secondVoice])-pitchToMidi(secondPitch);
    const before=Math.abs(pitchToMidi(secondPitch)-pitchToMidi(firstPitch))%12;
    const after=Math.abs(pitchToMidi(next[secondVoice])-pitchToMidi(next[firstVoice]))%12;
    return firstMotion!==0&&Math.sign(firstMotion)===Math.sign(secondMotion)&&before===after&&(before===0||before===7)?[[index,index+1,firstVoice,secondVoice,before]]:[];
  }));
});

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
  it('plays every generic PART 14-16 pitch group as a simultaneous chord',()=>{
    for(const item of lessons){
      const block=item.blocks.find((candidate)=>candidate.type==='activity.subject');
      if((block?.data as {tool?:string}).tool!=='pitch-pair-viewer')continue;
      expect((block?.data as {input:{playbackMode?:string}}).input.playbackMode,item.id).toBe('simultaneous');
    }
  });
  it('uses close SATB motion in the voice-leading introduction',()=>{
    expect(groupNames('harmony.lesson.voice-leading-basics.lesson')).toEqual([
      ['C3','C4','E4','G4'],
      ['G3','B3','D4','G4'],
    ]);
  });
  it('resolves the V7 tendency tones correctly in the cadence example',()=>{
    expect(groupNames('harmony.lesson.cadence-writing.lesson')).toEqual([
      ['G3','D4','F4','B4'],
      ['C3','C4','E4','C5'],
    ]);
  });
  it('uses contrary outer motion without direct parallel fifths or octaves in the connection example',()=>{
    const groups=lessonById('harmony.lesson.connection-rules.lesson')?.data?.[0].value as Pitch[][];
    expect(groups.map((group)=>group.map(pitchName))).toEqual([
      ['C3','G3','E4','C5'],
      ['G2','G3','B3','D5'],
      ['C3','G3','E4','C5'],
    ]);
    expect(directPerfectParallels(groups)).toEqual([]);
    expect(Math.sign(pitchToMidi(groups[1][0])-pitchToMidi(groups[0][0]))).toBe(-1);
    expect(Math.sign(pitchToMidi(groups[1][3])-pitchToMidi(groups[0][3]))).toBe(1);
  });
  it('uses four ordered voices without direct perfect parallels in the chorale example',()=>{
    const groups=lessonById('harmony.lesson.chorale-analysis.lesson')?.data?.[0].value as Pitch[][];
    expect(groups).toHaveLength(8);
    expect(groups.every((group)=>group.length===4)).toBe(true);
    expect(groups[0].map(pitchName)).toEqual(['C3','C4','E4','G4']);
    expect(groups[7].map(pitchName)).toEqual(['C3','C4','E4','G4']);
    expect(directPerfectParallels(groups)).toEqual([]);
  });
  it('spells the augmented sixth above A-flat and resolves both tendency tones to G',()=>{
    const groups=lessonById('harmony.lesson.romantic-harmony.lesson')?.data?.[0].value as Pitch[][];
    expect(groups[2].map(pitchName)).toEqual(['A♭4','C5','F♯5']);
    expect(groups[3].map(pitchName)).toEqual(['G4','B4','D5','G5']);
    expect(pitchToMidi(groups[3][0])-pitchToMidi(groups[2][0])).toBe(-1);
    expect(pitchToMidi(groups[3][3])-pitchToMidi(groups[2][2])).toBe(1);
  });
  it('keeps the I-IV-V-I exercise in consistent bass-to-soprano order',()=>{
    expect(groupNames('harmony.lesson.four-part-harmony.lesson')).toEqual([
      ['C3','C4','E4','G4'],
      ['F3','C4','F4','A4'],
      ['G3','B3','D4','G4'],
      ['C3','C4','E4','G4'],
    ]);
  });
  it('completes the full 76-lesson RC1 inventory',()=>{expect(harmonyBook.parts.flatMap((part)=>part.lessons)).toHaveLength(76);});
  it('passes schema, ID, reference and block validation',()=>{expect(validateBook(harmonyBook,{supportedBlockTypes:commonBlockKinds})).toEqual([]);});
});
