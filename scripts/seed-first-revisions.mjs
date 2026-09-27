/**
 * Builds the first three-day revision for every roadmap from reviewed lecture
 * topic screens. The check reuses reviewed final-quiz questions; retrieval
 * cards never do. Optionally publishes a new immutable content version.
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

// Four topic-sized retrieval cues per lecture. The back is assembled from the
// matching reviewed lecture screens below, never from a quiz explanation.
const CARD_SPECS = {
  webd: [
    ['Why do `head` and `body` exist as separate rooms, and what belongs in each?', 'The complete document'],
    ['Why can a page display mojibake even though every HTML tag is correct?', 'Character decoding fails as wrong text, not as a blank page'],
    ['Why is a heading level a structure decision rather than a font-size choice?', 'Headings are an outline, not a size picker'],
    ['Repair a document with crossing tags. What tree rule tells you which closing tag comes first?', 'Nesting preserves the tree'],
    ['A form control is visible and editable, but its value is missing from the submitted URL. What is the likely cause?', '`name` is the shipping label'],
    ['Why is nearby text not a sufficient label, and what interaction should a real label provide?', 'A label is an interaction, not nearby text'],
    ['When should a form use GET rather than POST, and what does that choice actually change?', 'GET and POST solve different transport needs'],
    ['Why is a number input wrong for a phone number or postal code even though both contain digits?', 'A number field is for quantity, not digits'],
    ['An external stylesheet appears to do nothing. What should you verify before changing selectors?', 'The Network panel answers whether the browser received the file'],
    ['Explain how the browser turns one CSS rule into painted pixels.', 'Follow one external rule from file to pixels'],
    ['When should you choose a class, an ID, or an attribute selector?', 'Classes describe reusable roles; IDs identify one document target'],
    ['Why does a hover-only interaction fail for keyboard users, and what state must CSS also represent?', 'Hover works, then the keyboard exposes the missing state'],
  ],
  daml: [
    ['Before calculating anything, why must an analyst identify what one row represents?', 'Feedback: begin with the row'],
    ['Why is a DataFrame better pictured as a labelled rectangle than as “an Excel sheet in Python”?', 'A DataFrame is a labelled rectangle'],
    ['A CSV will not load. Why should you diagnose the path before questioning the data?', 'Diagnose the path before the data'],
    ['Why can counting rows produce a confidently wrong count of people?', 'Count labels, not people'],
    ['What does Python do on the right side of an assignment before a name is bound?', 'The mental model: Python evaluates, then binds'],
    ['Why can changing a value from text to number change the meaning of `+`?', 'Literals and types'],
    ['Why must every arithmetic result retain its units during an analysis?', 'Arithmetic needs units'],
    ['After `rate = wins / games`, why does changing `wins` not automatically update `rate`?', 'Feedback: names do not create live formulas'],
    ['How does one changed comparison character alter the business policy at a boundary?', 'Feedback: the character changes the policy'],
    ['Why can `and` safely stop after the first false condition?', 'Feedback: `and` rejects on the first failure'],
    ['When do separate `if` statements behave differently from one `if`/`elif` chain?', 'Separate `if` statements answer a different question'],
    ['Why must a missing category get an explicit path instead of falling into an ordinary category?', 'Missing categories need their own path'],
  ],
  ml: [
    ['What makes a rule a machine-learning model rather than a fixed hand-written formula?', 'A model is a rule with a part we can choose'],
    ['Why must fitting a model and using the fitted model be treated as different operations?', 'Separate fitting from using the result'],
    ['How do features, targets, parameters, and hyperparameters play different roles?', 'Give the table\'s parts names'],
    ['How does the source of feedback distinguish supervised, unsupervised, self-supervised, and reinforcement learning?', 'Four setups, four sources of feedback'],
    ['For k-nearest neighbours, why must distance happen before voting?', 'Feedback: distance first, vote second'],
    ['Why are class labels counted rather than averaged in a classification vote?', 'Count labels without treating them as measurements'],
    ['How can feature units silently decide which training rows count as “near”?', 'Units influence who is near'],
    ['Why must a baseline take exactly the same held-out exam as the model?', 'A baseline must take the same exam'],
    ['Why is a perfect training score not evidence that a model will work on new cases?', 'Two perfect scores can mean different things'],
    ['What does the gap between training and validation performance diagnose?', 'Read the gap as a clue'],
    ['How can a feature leak the answer without having the same name as the target?', 'A field can reveal an answer without sharing its name'],
    ['Why must preprocessing be fitted without crossing the train/test boundary?', 'Preprocessing is part of the learned procedure'],
  ],
  dsa: [
    ['Why are compiling and running separate steps, and how can that make an old result appear?', 'Why the old message survives'],
    ['What job does each line of a minimal C++ program perform?', 'What the five lines mean'],
    ['Why do quotes change `cout << value` from printing data to printing literal text?', 'Text and values behave differently'],
    ['Trace one input, calculation, and output. Where can each kind of failure occur?', 'Follow one read, one calculation, one write'],
    ['Why can assigning a multiplication to `long long` still overflow before assignment?', 'Inspect the calculation before the destination'],
    ['How do you decide whether `int` is safe from the problem constraints rather than intuition?', 'Calculate a bound, not a feeling'],
    ['Why does integer division lose information before a decimal destination can save it?', 'Integer division discards the fraction first'],
    ['When should you compare floating-point values with a tolerance instead of `==`?', 'Make “close enough” mean something'],
    ['How does an `if` condition turn one computed boolean into exactly one path?', 'A condition chooses a path'],
    ['Why can the order of `if`/`else if` branches protect a dangerous calculation?', 'The order of conditions can protect a calculation'],
    ['How do a `for` loop’s start, condition, and update jointly determine its exact iteration count?', 'A for-loop puts the schedule in one place'],
    ['What is the semantic difference between `break` and `continue` inside a loop?', 'Stop a loop or skip one iteration'],
  ],
  go: [
    ['Trace a Go program through editor, compiler, executable, and operating system. Who owns each failure?', 'The program travels through four owners'],
    ['Why does a Go module need a stable identity even when one loose file can run?', 'Give the project a stable identity'],
    ['How are module, package, file, and function different containers?', 'Module, package, file, and function are different containers'],
    ['Why does Go reject an unused import instead of merely warning?', 'The unused import failure is deliberate friction'],
    ['Why does every declared Go value immediately have a zero value?', 'The zero value appears before your first assignment'],
    ['What does `:=` do, and why can using it in an inner scope create a shadowing bug?', '`:=` combines declaration with the first value'],
    ['Why are `byte` and `rune` different units even when both are integer aliases?', '`byte` and `rune` name two different units'],
    ['Where must a conversion happen to prevent integer division from discarding the fraction?', 'Repair integer division at the right moment'],
    ['Why does Go require a boolean in `if` instead of treating numbers or strings as truthy?', 'Go requires a real boolean condition'],
    ['How does short-circuit evaluation change both correctness and which expressions run?', 'Short-circuiting prevents unnecessary evaluation'],
    ['When does a guard clause make a function easier to follow than nested branches?', 'Guard clauses appear when nesting starts to hide the main route'],
    ['How do the three parts of a Go `for` loop form a state machine?', 'The three-part `for` loop is a small machine'],
  ],
  reactnative: [
    ['Why can browser elements such as `div` not be rendered directly by React Native?', 'One component, two kinds of host'],
    ['What roles do Metro, Expo Go, and the native device each play in the development loop?', 'The development server is not the app'],
    ['Why does Metro follow an import graph instead of simply running every file in the folder?', 'Metro follows a graph, not a folder by instinct'],
    ['What boundary makes Expo Go convenient, and when does that boundary matter?', 'Expo Go is a native container with a boundary'],
    ['Why should a component name a repeated product idea rather than just shorten JSX?', 'A component names a repeated product idea'],
    ['How does a props type prevent three different kinds of component misuse?', 'Watch TypeScript reject three different contract breaks'],
    ['Why should props remain inputs instead of being copied into a second state system?', 'Props are inputs, not a second state system'],
    ['Why do remote images need explicit dimensions in React Native layout?', 'Images expose a missing-size failure'],
    ['Why does changing a plain variable not update the screen?', 'The variable that changes without changing the screen'],
    ['What connection does `useState` create between remembered data and another render?', '`useState` connects memory to another render'],
    ['Why can several value-form state updates collapse while updater functions accumulate?', 'Queue feedback: values replace, updaters calculate'],
    ['Why should state store the meaning of an interaction rather than the entire event object?', 'Store the meaning, not the whole event report'],
  ],
};

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

function stripQuizBlocks(markdown) {
  return markdown.replace(/```(?:quiz|finalquiz)\s[\s\S]*?\n```/g, '').trim();
}

function closeOpenFence(markdown) {
  const fences = markdown.match(/^```/gm)?.length ?? 0;
  return fences % 2 === 0 ? markdown : `${markdown}\n\`\`\``;
}

function trimBack(markdown, maxWords = 220) {
  if (wordCount(markdown) <= maxWords) return markdown.trim();
  const lines = markdown.split('\n');
  const kept = [];
  for (const line of lines) {
    if (wordCount([...kept, line].join('\n')) > maxWords) break;
    kept.push(line);
  }
  return closeOpenFence(kept.join('\n').trim());
}

function lectureScreens(markdown) {
  return stripQuizBlocks(markdown).split(/^---$/m).map(screen => screen.trim()).filter(Boolean);
}

function buildCardBack(screens, heading, file) {
  const start = screens.findIndex(screen => screen.startsWith(`## ${heading}\n`) || screen === `## ${heading}`);
  if (start < 0) throw new Error(`Missing card source heading "${heading}" in ${file}`);
  const parts = [];
  for (let index = start; index < screens.length && wordCount(parts.join('\n\n')) < 130; index += 1) {
    const body = screens[index].replace(/^## .+\n+/, '').trim();
    if (body && !body.startsWith('## Practice') && !body.startsWith('## Cheat sheet')) parts.push(body);
  }
  const back = trimBack(parts.join('\n\n'));
  if (wordCount(back) < 100) throw new Error(`Card source "${heading}" in ${file} is too thin`);
  return back;
}

function buildDocument([roadmapId, conceptId, targetId]) {
  const lectures = lectureFiles(roadmapId).map(file => {
    const markdown = fs.readFileSync(file, 'utf8');
    const title = markdown.match(/^#\s+(.+)$/m)?.[1] ?? path.basename(file);
    return { title, file, screens: lectureScreens(markdown), quiz: finalQuiz(markdown, file) };
  });

  const quiz = lectures.flatMap((lecture, lectureIndex) => lecture.quiz.questions.slice(0, 4).map((question, questionIndex) => ({
    ...question,
    id: `d${lectureIndex + 1}q${questionIndex + 1}`,
    sourceTopics: [lecture.title],
  })));
  const concepts = CARD_SPECS[roadmapId].map(([front, topicTitle], index) => {
    const lecture = lectures[Math.floor(index / 4)];
    return {
      front,
      back: buildCardBack(lecture.screens, topicTitle, lecture.file),
      lectureTitle: lecture.title,
      topicTitle,
    };
  });

  if (quiz.length !== 12 || concepts.length !== 12) throw new Error(`${roadmapId} did not produce 12 cards and 12 questions`);
  return {
    roadmapId, conceptId, targetId, kind: 'revision', version: 2,
    recap: `Days 1–3 establish the mental models and boundary rules that the rest of this course assumes. Attempt each cue before revealing its explanation; the cards move across all three days so you must identify the relevant rule rather than follow lecture order. The final check changes examples and mixes the material again. A miss means the matching mechanism needs another retrieval attempt—not that the answer should be reread repeatedly.`,
    concepts, quiz, model: 'authored-from-reviewed-lecture-topics', createdAt: new Date(),
  };
}

const documents = SPECS.map(buildDocument);
for (const doc of documents) {
  const counts = doc.concepts.map(card => wordCount(card.back));
  const forbidden = /reconstruct the cause-and-effect|recognising the answer after reveal|on the next attempt, change one detail/i;
  if (doc.concepts.some(card => forbidden.test(card.back))) {
    throw new Error(`${doc.roadmapId} contains forbidden generic card filler`);
  }
  console.log(`${doc.roadmapId}: ${doc.concepts.length} cards, ${doc.quiz.length} questions, card backs ${Math.min(...counts)}-${Math.max(...counts)} words`);
}

if (process.argv.includes('--apply')) {
  const env = { ...loadEnv(), ...process.env };
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  const client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  const collection = client.db(env.MONGODB_DB || 'decko').collection('revision_content');
  for (const doc of documents) {
    const result = await collection.updateOne(
      { roadmapId: doc.roadmapId, conceptId: doc.conceptId, targetId: doc.targetId, version: doc.version },
      { $setOnInsert: doc },
      { upsert: true },
    );
    console.log(`${doc.roadmapId}: ${result.upsertedCount ? 'published' : `version ${doc.version} already exists`}`);
  }
  await client.close();
  console.log('Published all six first revisions.');
}
