// Validates every ```quiz / ```finalquiz block in every lecture.
// See guidelines/quiz-blocks.md for the contract this enforces.
//
// Usage: npm run validate:quizzes
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const NL = String.fromCharCode(10);
const FENCE = '`'.repeat(3);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

// Scan line by line for an opener and the next BARE fence. A non-greedy regex
// would stop at the first language-tagged fence inside the JSON payload and
// silently truncate it — the bug that corrupted eight lecture files.
function extractBlocks(source) {
  const lines = source.split(NL);
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^```(quiz|finalquiz)\s*$/);
    if (!open) continue;
    let close = -1;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^```\s*$/.test(lines[j])) { close = j; break; }
    }
    if (close === -1) {
      blocks.push({ kind: open[1], line: i + 1, body: null });
      continue;
    }
    blocks.push({ kind: open[1], line: i + 1, body: lines.slice(i + 1, close).join(NL) });
    i = close;
  }
  return blocks;
}

// Every fence inside a payload must carry a language tag, or it terminates the
// block early. Also flags bare multi-line code that Markdown would reflow.
function checkStrings(value, where, issues) {
  if (typeof value !== 'string') return;
  for (const fence of value.match(/```[^\n]*/g) ?? []) {
    if (fence.trim() === FENCE) continue;                 // a closing fence — fine
    if (!/^```[a-zA-Z0-9+#-]+$/.test(fence.trim())) {
      issues.push(`${where}: fence "${fence.trim()}" needs a bare language tag`);
    }
  }
  const fenceCount = (value.match(/```/g) ?? []).length;
  if (fenceCount % 2 !== 0) issues.push(`${where}: unbalanced fences inside the string`);
  if (fenceCount === 0 && value.includes(NL)) {
    // Prose may legitimately span paragraphs; bare code may not. Code already
    // wrapped in inline backticks per line is fine — the renderer treats single
    // newlines as hard breaks, so each line still lands on its own row.
    const codey = /[{};]|=>|:=|\bfunc\b|\bconst\b|\bvar\b|\bdef\b|print|console\./.test(value);
    const prose = value.includes('**') || /[a-z]\. [A-Z]/.test(value);
    const markedUp = value.includes('`');
    if (codey && !prose && !markedUp) {
      issues.push(`${where}: multi-line code is not fenced (Markdown will reflow it)`);
    }
  }
}

function checkQuestion(q, idx, issues) {
  const at = `q${idx + 1}`;
  if (!q || typeof q !== 'object' || Array.isArray(q)) {
    issues.push(`${at}: question must be an object`);
    return;
  }
  if (q.type !== 'single_correct' && q.type !== 'multiple_correct') issues.push(`${at}: bad type "${q.type}"`);
  if (typeof q.prompt !== 'string' || q.prompt.trim() === '') issues.push(`${at}: missing prompt`);
  if (!Array.isArray(q.options) || q.options.length !== 4) issues.push(`${at}: needs exactly 4 options`);
  if (!Array.isArray(q.correctOptionIds) || q.correctOptionIds.length === 0) issues.push(`${at}: no correctOptionIds`);
  if (q.type === 'multiple_correct' && (q.correctOptionIds?.length ?? 0) < 2) issues.push(`${at}: multiple_correct needs 2+`);
  if (q.type === 'single_correct' && q.correctOptionIds?.length !== 1) issues.push(`${at}: single_correct needs exactly 1`);

  const optionIds = (q.options ?? []).map(o => o?.id);
  const ids = new Set(optionIds);
  if (optionIds.join(',') !== 'a,b,c,d') issues.push(`${at}: option ids must be a, b, c, d in authored order`);
  (q.options ?? []).forEach((o, i) => {
    if (!o || typeof o !== 'object' || typeof o.text !== 'string' || o.text.trim() === '') {
      issues.push(`${at}.option[${o?.id ?? i}]: missing text`);
    }
  });
  if (Array.isArray(q.correctOptionIds) && new Set(q.correctOptionIds).size !== q.correctOptionIds.length) {
    issues.push(`${at}: duplicate correctOptionIds`);
  }
  for (const id of q.correctOptionIds ?? []) {
    if (!ids.has(id)) issues.push(`${at}: correctOptionIds "${id}" is not an option id`);
  }
  if (!q.explanation) issues.push(`${at}: missing explanation`);
  if (!q.example) issues.push(`${at}: missing example`);

  checkStrings(q.prompt, `${at}.prompt`, issues);
  checkStrings(q.explanation, `${at}.explanation`, issues);
  checkStrings(q.example, `${at}.example`, issues);
  (q.options ?? []).forEach((o, i) => checkStrings(o.text, `${at}.option[${o.id ?? i}]`, issues));
}

const files = walk(path.join(ROOT, 'public/data/lectures'));
let badFiles = 0;
let blockCount = 0;

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const blocks = extractBlocks(source);
  if (blocks.length === 0) continue;

  const issues = [];
  const finals = blocks.filter(b => b.kind === 'finalquiz');
  if (finals.length > 1) issues.push(`${finals.length} finalquiz blocks (expected 1)`);

  for (const block of blocks) {
    blockCount++;
    const at = `${block.kind}@${block.line}`;
    if (block.body === null) { issues.push(`${at}: no closing bare fence`); continue; }

    let data;
    try { data = JSON.parse(block.body); }
    catch (e) { issues.push(`${at}: JSON parse error — ${e.message}`); continue; }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      issues.push(`${at}: payload must be a JSON object`);
      continue;
    }

    if (block.kind === 'finalquiz') {
      if (typeof data.title !== 'string' || data.title.trim() === '') issues.push(`${at}: missing title`);
      const qs = data.questions;
      if (!Array.isArray(qs) || qs.length !== 10) issues.push(`${at}: ${qs?.length ?? 0} questions (expected 10)`);
      (qs ?? []).forEach((q, i) => {
        if (q.id !== `q${i + 1}`) issues.push(`${at}: question ${i + 1} has id "${q.id}"`);
        checkQuestion(q, i, issues);
      });
    } else {
      if (!data.prompt) issues.push(`${at}: missing prompt`);
      if (!Array.isArray(data.options) || data.options.length < 2) issues.push(`${at}: needs 2+ options`);
      if (!(data.options ?? []).some(o => o.correct)) issues.push(`${at}: no correct option`);
      if (!data.explanation) issues.push(`${at}: missing explanation`);
      (data.options ?? []).forEach((o, i) => {
        if (!o || typeof o !== 'object' || typeof o.text !== 'string' || o.text.trim() === '') {
          issues.push(`${at}.option[${i}]: missing text`);
        }
        if ('correct' in (o ?? {}) && typeof o.correct !== 'boolean') {
          issues.push(`${at}.option[${i}]: correct must be boolean when present`);
        }
      });
      checkStrings(data.prompt, `${at}.prompt`, issues);
      checkStrings(data.explanation, `${at}.explanation`, issues);
      (data.options ?? []).forEach((o, i) => checkStrings(o.text, `${at}.option[${i}]`, issues));
    }
  }

  if (issues.length) {
    badFiles++;
    console.log('BAD ' + path.relative(ROOT, file));
    for (const issue of issues.slice(0, 8)) console.log('    ' + issue);
    if (issues.length > 8) console.log(`    …and ${issues.length - 8} more`);
  }
}

console.log(
  badFiles === 0
    ? `OK — ${blockCount} quiz blocks valid across ${files.length} lectures`
    : `${badFiles} file(s) with problems`
);

process.exit(badFiles === 0 ? 0 : 1);
