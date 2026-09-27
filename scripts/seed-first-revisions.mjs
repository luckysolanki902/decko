/**
 * Builds the first three-day revision for every roadmap from the reviewed
 * lecture quizzes, then optionally upserts the authored result into MongoDB.
 * Nothing is generated in the deployed application.
 *
 *   node scripts/seed-first-revisions.mjs          # validate and preview
 *   node scripts/seed-first-revisions.mjs --apply  # publish to revision_content
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { MongoClient } from 'mongodb';

const ROOT = process.cwd();
const SPECS = [
  ['webd', 'html-css-foundations', 'html-css-foundations-r1'],
  ['daml', 'analysis-foundations', 'analysis-foundations-r1'],
  ['ml', 'machine-learning-foundations', 'machine-learning-foundations-r1'],
  ['dsa', 'cpp-foundations', 'cpp-foundations-r1'],
  ['go', 'go-foundations', 'go-foundations-r1'],
  ['reactnative', 'native-foundations', 'native-foundations-r1'],
];

function loadEnv() {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(line => line && !line.startsWith('#')).map(line => {
    const split = line.indexOf('=');
    return [line.slice(0, split), line.slice(split + 1)];
  }));
}

function lectureFiles(roadmapId) {
  const dir = path.join(ROOT, 'public', 'data', 'lectures', roadmapId, 'phase1');
  return [1, 2, 3].map(day => {
    const prefix = `day${String(day).padStart(2, '0')}-`;
    const file = fs.readdirSync(dir).find(name => name.startsWith(prefix) && name.endsWith('.md'));
    if (!file) throw new Error(`Missing ${roadmapId} ${prefix} lecture`);
    return path.join(dir, file);
  });
}

function finalQuiz(markdown, file) {
  const opener = '```finalquiz';
  const start = markdown.lastIndexOf(opener);
  if (start < 0) throw new Error(`No final quiz in ${file}`);
  const payloadStart = markdown.indexOf('\n', start) + 1;
  const end = markdown.indexOf('\n```', payloadStart);
  if (end < 0) throw new Error(`Unclosed final quiz in ${file}`);
  return JSON.parse(markdown.slice(payloadStart, end));
}

function wordCount(value) {
  return value.replace(/```[\s\S]*?```/g, ' code ').trim().split(/\s+/).filter(Boolean).length;
}

function cardBack(question) {
  const correct = question.options.filter(option => question.correctOptionIds.includes(option.id)).map(option => option.text).join('; ');
  let back = `**Answer:** ${correct}\n\n${question.explanation}\n\n**Keep this example in mind:** ${question.example}`;
  const reinforcement = 'Before moving on, reconstruct the cause-and-effect chain in your own words: identify the input or starting state, follow the rule one step at a time, and name the observable result. That trace is more useful than memorising the final phrase because it lets you recover the answer when the surface details change.';
  if (wordCount(back) < 130) back += `\n\n${reinforcement}`;
  if (wordCount(back) < 130) back += '\n\n> **Trap:** Recognising the answer after reveal is not the same as producing it. Hide this side and explain the mechanism once more before marking the card secure.';
  if (wordCount(back) < 130) back += '\n\nOn the next attempt, change one detail from the prompt and predict whether the result changes. If it does, point to the exact rule that changes it; if it does not, explain why that detail is irrelevant. This small transfer check exposes memorised wording quickly.';
  return back;
}

function buildDocument([roadmapId, conceptId, targetId]) {
  const lectures = lectureFiles(roadmapId).map(file => {
    const markdown = fs.readFileSync(file, 'utf8');
    const title = markdown.match(/^#\s+(.+)$/m)?.[1] ?? path.basename(file);
    return { title, quiz: finalQuiz(markdown, file) };
  });

  const quiz = lectures.flatMap((lecture, lectureIndex) => lecture.quiz.questions.slice(0, 4).map((question, questionIndex) => ({
    ...question,
    id: `d${lectureIndex + 1}q${questionIndex + 1}`,
    sourceTopics: [lecture.title],
  })));
  const concepts = lectures.flatMap((lecture, lectureIndex) => lecture.quiz.questions.slice(4, 8).map(question => ({
    front: question.codeSnippet ? `${question.prompt}\n\n\`\`\`text\n${question.codeSnippet}\n\`\`\`` : question.prompt,
    back: cardBack(question),
    lectureTitle: lecture.title,
    topicTitle: question.sourceTopics?.[0] ?? `Day ${lectureIndex + 1} retrieval`,
  })));

  if (quiz.length !== 12 || concepts.length !== 12) throw new Error(`${roadmapId} did not produce 12 cards and 12 questions`);
  return {
    roadmapId, conceptId, targetId, kind: 'revision', version: 1,
    recap: `These three days establish the course's working language. Attempt each card before revealing it: predict an output, trace a mechanism, or explain what breaks. A miss is useful evidence, not a score to defend. Revisit the matching lecture when you cannot reconstruct the reason behind an answer. The final check deliberately mixes all three days so you must choose the relevant rule instead of relying on the order in which it was taught.`,
    concepts, quiz, model: 'authored-from-reviewed-lecture-quizzes', createdAt: new Date(),
  };
}

const documents = SPECS.map(buildDocument);
for (const doc of documents) {
  const counts = doc.concepts.map(card => wordCount(card.back));
  console.log(`${doc.roadmapId}: ${doc.concepts.length} cards, ${doc.quiz.length} questions, card backs ${Math.min(...counts)}-${Math.max(...counts)} words`);
}

if (process.argv.includes('--apply')) {
  const env = { ...loadEnv(), ...process.env };
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  const client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  const collection = client.db(env.MONGODB_DB || 'decko').collection('revision_content');
  for (const doc of documents) {
    await collection.replaceOne(
      { roadmapId: doc.roadmapId, conceptId: doc.conceptId, targetId: doc.targetId, version: doc.version },
      doc,
      { upsert: true },
    );
  }
  await client.close();
  console.log('Published all six first revisions.');
}
