import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const sourcePath=resolve(root,'legacy/harmony-rc1/harmony_textbook_rc1.html');
const outputPath=resolve(root,'migration/harmony-rc1-checkpoints.json');
const html=readFileSync(sourcePath,'utf8');
const clean=(value)=>value.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();

const checkpoints=[];
const sectionPattern=/<section class="part-checkpoint" id="checkpoint-(\d+)">([\s\S]*?)<\/section>/g;
let section;
while((section=sectionPattern.exec(html))){
  const part=Number(section[1]); const questions=[];
  const questionPattern=/<div class="rc-q" data-answer="([^"]+)">([\s\S]*?)<\/div>\s*<\/div>/g;
  let question;
  while((question=questionPattern.exec(section[2]))){
    const body=question[2];
    const prompt=clean(body.match(/<div class="rc-question">([\s\S]*?)<\/div>/)?.[1]??'').replace(/^\d+\.\s*/, '');
    const options=[...body.matchAll(/<button data-value="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g)].map((item)=>({value:clean(item[1]),label:clean(item[2])}));
    const explanation=clean(body.match(/<div class="rc-explain">([\s\S]*?)<\/div>/)?.[1]??'');
    questions.push({id:`harmony.rc1.checkpoint.${part}.${questions.length+1}`,prompt,options,answer:clean(question[1]),explanation});
  }
  checkpoints.push({part,id:`checkpoint-${part}`,questions});
}

const questionCount=checkpoints.reduce((sum,item)=>sum+item.questions.length,0);
if(checkpoints.length!==14||questionCount!==56)throw new Error(`Expected 14 checkpoints and 56 questions, found ${checkpoints.length} and ${questionCount}`);
for(const checkpoint of checkpoints)for(const question of checkpoint.questions){if(question.options.length!==4)throw new Error(`${question.id} must have four options`);if(!question.options.some((option)=>option.value===question.answer))throw new Error(`${question.id} answer is not an option`);}
mkdirSync(dirname(outputPath),{recursive:true});
writeFileSync(outputPath,`${JSON.stringify({source:'Harmony RC1',parts:[3,4,5,6,7,8,9,10,11,12,13,14,15,16],checkpointCount:checkpoints.length,questionCount,checkpoints},null,2)}\n`);
console.log(`Extracted ${questionCount} questions from ${checkpoints.length} checkpoints to ${outputPath}`);
