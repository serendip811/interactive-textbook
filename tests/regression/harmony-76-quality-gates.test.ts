import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe,expect,it } from 'vitest';
import { harmonyBook } from '../../books/harmony/src';

const lessons=harmonyBook.parts.flatMap((part)=>part.lessons);
const legacyHtml=readFileSync(resolve(process.cwd(),'legacy/harmony-rc1/harmony_textbook_rc1.html'),'utf8');
const checkpointData=JSON.parse(readFileSync(resolve(process.cwd(),'migration/harmony-rc1-checkpoints.json'),'utf8')) as {checkpointCount:number;questionCount:number;checkpoints:Array<{questions:Array<{options:Array<{value:string}>;answer:string}>}>};
const clean=(value:string)=>value.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const legacyLessons=[...legacyHtml.matchAll(/<article class="lesson" id="lesson-(\d+)-(\d+)">([\s\S]*?)<\/article>/g)].map((match)=>({legacyId:`${match[1]}-${match[2]}`,title:clean(match[3].match(/<h3>([\s\S]*?)<\/h3>/)?.[1]??'')}));

describe('Harmony 76-lesson quality gates',()=>{
  it('preserves every RC1 lesson number and title',()=>{
    expect(lessons.map((lesson)=>lesson.title)).toEqual(legacyLessons.map((lesson)=>`${lesson.legacyId}. ${lesson.title}`));
  });
  it('connects every lesson to an objective, activity, summary and completion rule',()=>{
    for(const lesson of lessons){
      expect(lesson.objectives.length,lesson.id).toBeGreaterThan(0);
      expect(lesson.blocks.some((block)=>block.type==='activity.subject'),lesson.id).toBe(true);
      expect(lesson.blocks.some((block)=>block.type==='content.summary'),lesson.id).toBe(true);
      expect(lesson.completion.type,lesson.id).toBe('required-blocks');
      const objectiveIds=new Set(lesson.objectives.map((objective)=>objective.id));
      for(const block of lesson.blocks)for(const ref of block.objectiveRefs??[])expect(objectiveIds.has(ref),`${lesson.id}: ${ref}`).toBe(true);
    }
  });
  it('keeps every multiple-choice answer reachable from its options',()=>{
    for(const lesson of lessons)for(const block of lesson.blocks){
      if(block.type!=='assessment.multiple-choice')continue;
      const data=block.data as {answer:string;options:Array<{id:string}>};
      expect(data.options.some((option)=>option.id===data.answer),block.id).toBe(true);
    }
  });
  it('preserves all 14 RC1 checkpoints and 56 answer keys as migration evidence',()=>{
    expect(checkpointData.checkpointCount).toBe(14);expect(checkpointData.questionCount).toBe(56);
    for(const checkpoint of checkpointData.checkpoints)for(const question of checkpoint.questions)expect(question.options.some((option)=>option.value===question.answer)).toBe(true);
  });
  it('attaches all 56 RC1 checkpoint questions to their mapped lessons and completion rules',()=>{
    const checkpointBlocks=lessons.flatMap((lesson)=>lesson.blocks.filter((block)=>block.id.startsWith('harmony.checkpoint.')).map((block)=>({lesson,block})));
    expect(checkpointBlocks).toHaveLength(56);
    for(const {lesson,block} of checkpointBlocks){
      expect(block.type).toBe('assessment.multiple-choice');
      expect((block.data as {explanation:string}).explanation.trim(),block.id).not.toBe('');
      expect(lesson.completion.type).toBe('required-blocks');
      if(lesson.completion.type==='required-blocks')expect(lesson.completion.blockRefs).toContain(block.id);
    }
  });
});
