#!/usr/bin/env node
/**
 * Counts authored lectures, words and quiz blocks per course.
 *
 * The homepage cards in `src/data/courses.ts` quote lecture counts; run this
 * after authoring a batch so the numbers on the site stay honest.
 *
 * Usage: npm run stats
 */

import fs from 'node:fs';
import path from 'node:path';

const LECTURES_DIR = path.join(process.cwd(), 'public', 'data', 'lectures');

if (!fs.existsSync(LECTURES_DIR)) {
  console.error(`No lectures directory at ${LECTURES_DIR}`);
  process.exit(1);
}

/** Every .md file under a directory, at any depth. */
function markdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

const courses = fs
  .readdirSync(LECTURES_DIR, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();

let totalLectures = 0;
let totalWords = 0;
let totalQuizzes = 0;

const rows = courses.map(course => {
  const files = markdownFiles(path.join(LECTURES_DIR, course));
  let words = 0;
  let quizzes = 0;

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    words += text.split(/\s+/).filter(Boolean).length;
    quizzes += (text.match(/```(quiz|finalquiz)/g) || []).length;
  }

  totalLectures += files.length;
  totalWords += words;
  totalQuizzes += quizzes;

  return { course, lectures: files.length, words, quizzes };
});

const pad = (value, width) => String(value).padEnd(width);
const padStart = (value, width) => String(value).padStart(width);

console.log(`${pad('COURSE', 14)}${padStart('LECTURES', 9)}${padStart('WORDS', 10)}${padStart('QUIZZES', 9)}`);
console.log('-'.repeat(42));

for (const row of rows) {
  console.log(
    `${pad(row.course, 14)}${padStart(row.lectures, 9)}${padStart(row.words.toLocaleString(), 10)}${padStart(row.quizzes, 9)}`
  );
}

console.log('-'.repeat(42));
console.log(
  `${pad('TOTAL', 14)}${padStart(totalLectures, 9)}${padStart(totalWords.toLocaleString(), 10)}${padStart(totalQuizzes, 9)}`
);
