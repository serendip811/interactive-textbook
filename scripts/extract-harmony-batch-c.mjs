import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(root, 'legacy/harmony-rc1/harmony_textbook_rc1.html');
const outputPath = resolve(root, 'migration/harmony-batch-c-extract.json');
const html = readFileSync(sourcePath, 'utf8');
const text = (value) => value.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

const lessons = [];
const pattern = /<article class="lesson" id="lesson-(\d+)-(\d+)">([\s\S]*?)<\/article>/g;
let match;
while ((match = pattern.exec(html))) {
  const part = Number(match[1]);
  if (part < 6 || part > 9) continue;
  const body = match[3];
  const sequences = [...body.matchAll(/data-sequence='([^']+)'/g)].map((item) => JSON.parse(item[1]));
  lessons.push({
    legacyId: `${part}-${match[2]}`,
    targetId: `harmony.lesson.${part}-${match[2]}`,
    part,
    title: text(body.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] ?? ''),
    content: [...body.matchAll(/<(p|li)[^>]*>([\s\S]*?)<\/\1>/g)].map((item) => text(item[2])).filter(Boolean),
    sequences,
    evidence: {
      notationCount: (body.match(/data-notation-engine=/g) ?? []).length,
      keyboardCount: (body.match(/class="lesson-keyboard"/g) ?? []).length,
      playButtonCount: (body.match(/class="play"/g) ?? []).length,
      stepButtonCount: (body.match(/class="step-play"/g) ?? []).length,
    },
    review: { content: 'pending', music: 'pending', interaction: 'pending' },
  });
}

if (lessons.length !== 19) throw new Error(`Batch C must contain 19 lessons, found ${lessons.length}`);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify({ source: 'Harmony RC1', batch: 'C', parts: [6, 7, 8, 9], lessons }, null, 2)}\n`);
console.log(`Extracted ${lessons.length} lessons to ${outputPath}`);
