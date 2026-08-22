import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(testDir, '..');
const sourcePath = resolve(root, 'legacy/harmony-rc1/harmony_textbook_rc1.html');
const html = readFileSync(sourcePath, 'utf8');
const contentHtml = html.slice(0, html.indexOf('</main>'));

const expectedRepresentatives = ['1-2', '2-3', '4-2', '8-5', '15-2', '14-4'];
const pitchClass = {
  C: 0, Cs: 1, Db: 1, D: 2, Ds: 3, Eb: 3, E: 4,
  F: 5, Fs: 6, Gb: 6, G: 7, Gs: 8, Ab: 8,
  A: 9, As: 10, Bb: 10, B: 11,
};
const letterIndex = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

function occurrences(pattern, source = html) {
  return [...source.matchAll(pattern)].length;
}

function article(id) {
  const match = html.match(new RegExp(`<article class="lesson" id="lesson-${id}">([\\s\\S]*?)<\\/article>`));
  assert.ok(match, `lesson ${id} should exist`);
  return match[1];
}

function sequences(source = contentHtml) {
  return [...source.matchAll(/data-sequence='([^']+)'/g)].map((match) => ({
    raw: match[1],
    value: JSON.parse(match[1]),
  }));
}

function midi(note) {
  const match = note.match(/^([A-G])([sb]?)(\d)$/);
  assert.ok(match, `valid pitch token: ${note}`);
  return (Number(match[3]) + 1) * 12 + pitchClass[match[1] + match[2]];
}

function semitones(a, b) {
  return Math.abs(midi(b) - midi(a));
}

function degree(a, b) {
  const left = a.match(/^([A-G])([sb]?)(\d)$/);
  const right = b.match(/^([A-G])([sb]?)(\d)$/);
  assert.ok(left && right);
  const leftStep = Number(left[3]) * 7 + letterIndex[left[1]];
  const rightStep = Number(right[3]) * 7 + letterIndex[right[1]];
  return Math.abs(rightStep - leftStep) + 1;
}

test('RC1 baseline structure remains frozen', () => {
  assert.equal(occurrences(/<article class="lesson" id="lesson-/g), 76);
  assert.equal(occurrences(/<div class="part-divider">/g), 17);
  assert.equal(occurrences(/class="notation"/g), 119);
  assert.equal(occurrences(/class="lesson-keyboard"/g), 76);
  assert.equal(occurrences(/class="example-play"/g), 195);
  assert.equal(occurrences(/class="step-play"/g), 75);
  assert.equal(occurrences(/class="part-checkpoint"/g), 14);
  assert.equal(occurrences(/class="rc-q"/g), 56);
});

test('lesson IDs are unique and representative lessons exist', () => {
  const ids = [...html.matchAll(/<article class="lesson" id="lesson-([\d-]+)">/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  expectedRepresentatives.forEach((id) => assert.ok(ids.includes(id), `representative ${id}`));
});

test('all data-sequence values are valid pitch arrays', () => {
  const parsed = sequences();
  assert.ok(parsed.length > 0);
  parsed.forEach(({ value }) => {
    assert.ok(Array.isArray(value) && value.length > 0);
    value.forEach((step) => {
      assert.ok(Array.isArray(step) && step.length > 0);
      step.forEach((note) => assert.match(note, /^[A-G](?:s|b)?\d$/));
    });
  });
});

test('every lesson keyboard sequence has a matching play button sequence', () => {
  const ids = [...html.matchAll(/<article class="lesson" id="lesson-([\d-]+)">/g)].map((match) => match[1]);
  ids.forEach((id) => {
    const body = article(id);
    const keyboard = body.match(/class="lesson-keyboard" data-sequence='([^']+)'/);
    assert.ok(keyboard, `${id} keyboard data`);
    const playData = [...body.matchAll(/class="[^"]*example-play[^"]*" data-sequence='([^']+)'/g)].map((match) => match[1]);
    assert.ok(playData.includes(keyboard[1]), `${id} keyboard sequence should have a matching play button`);
  });
});

test('notation sequences have a matching listen button in the same lesson', () => {
  const ids = [...html.matchAll(/<article class="lesson" id="lesson-([\d-]+)">/g)].map((match) => match[1]);
  ids.forEach((id) => {
    const body = article(id);
    const notationData = [...body.matchAll(/class="notation"[^>]*data-sequence='([^']+)'/g)].map((match) => match[1]);
    const playData = new Set([...body.matchAll(/class="[^"]*example-play[^"]*" data-sequence='([^']+)'/g)].map((match) => match[1]));
    notationData.forEach((sequence) => assert.ok(playData.has(sequence), `${id} notation should have matching audio data`));
  });
});

test('2-4 is the only lesson without a step-play button', () => {
  const ids = [...html.matchAll(/<article class="lesson" id="lesson-([\d-]+)">/g)].map((match) => match[1]);
  const missing = ids.filter((id) => !article(id).includes('class="step-play"'));
  assert.deepEqual(missing, ['2-4']);
});

test('flat and sharp spellings preserve pitch identity without losing degree identity', () => {
  assert.equal(midi('Cs4'), midi('Db4'));
  assert.equal(midi('Fs4'), midi('Gb4'));
  assert.equal(degree('C4', 'Cs4'), 1);
  assert.equal(degree('C4', 'Db4'), 2);
});

test('interval degree and semitone reference values remain correct', () => {
  assert.equal(degree('C4', 'E4'), 3);
  assert.equal(semitones('C4', 'E4'), 4);
  assert.equal(degree('C4', 'Eb4'), 3);
  assert.equal(semitones('C4', 'Eb4'), 3);
  assert.equal(degree('C4', 'Fs4'), 4);
  assert.equal(semitones('C4', 'Fs4'), 6);
  assert.equal(degree('C4', 'C5'), 8);
  assert.equal(semitones('C4', 'C5'), 12);
});

test('triad representative contains major, minor, diminished, and augmented examples', () => {
  const body = article('4-2');
  const serialized = sequences(body).map(({ value }) => JSON.stringify(value)).join('\n');
  assert.match(serialized, /C4.*E4.*G4/);
  assert.match(serialized, /C4.*Eb4.*G4/);
  assert.match(serialized, /C4.*Eb4.*Gb4/);
  assert.match(serialized, /C4.*E4.*Gs4/);
});

test('every checkpoint answer exists among its choices', () => {
  const questions = [...html.matchAll(/<div class="rc-q" data-answer="([^"]+)">([\s\S]*?)<div class="rc-feedback">/g)];
  assert.equal(questions.length, 56);
  questions.forEach((match) => {
    const answer = match[1];
    const choices = [...match[2].matchAll(/data-value="([^"]+)"/g)].map((choice) => choice[1]);
    assert.ok(choices.includes(answer), `checkpoint answer should be selectable: ${answer}`);
  });
});

test('VexFlow dependency stays pinned to the documented version', () => {
  assert.match(html, /cdn\.jsdelivr\.net\/npm\/vexflow@4\.2\.2\/build\/cjs\/vexflow\.js/);
});
