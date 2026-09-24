// Randomises the order of quiz options so the correct answer isn't parked on
// the same letter every time. Used by the mid-lecture quick check, the
// end-of-lecture quiz, and the revision quiz.
//
// Two things make this less trivial than a plain shuffle:
//
// 1. Every renderer shows a POSITIONAL letter (option index -> A/B/C/D) while
//    `correctOptionIds` matches by id. Reordering alone would leave grading
//    correct but make an explanation that says "option (b)" point at whatever
//    now happens to sit in slot B. So we reassign ids to match the new
//    positions and rewrite letter references in the prose with the same
//    permutation.
// 2. It has to be stable for the life of the page. Reshuffling on every render
//    would move options under the reader's cursor, and shuffling during SSR
//    would produce a hydration mismatch. Callers shuffle once after mount and
//    memoise through `shuffleOnce`.

type Option = { id: string; text: string };

export type ShufflableQuestion = {
  id: string;
  options: Option[];
  correctOptionIds: string[];
  explanation?: string;
  example?: string;
};

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];

function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Rewrites "(b)" and "option b" style references using the old -> new letter
// map. Applied in a single pass so a->b and b->a can't chain into each other.
function remapLetterRefs(text: string | undefined, map: Record<string, string>): string | undefined {
  if (!text) return text;
  return text
    .replace(/\(([a-f])\)/g, (whole, letter: string) => (map[letter] ? `(${map[letter]})` : whole))
    .replace(/\b([Oo]ptions?)\s+([a-f])\b/g, (whole, word: string, letter: string) =>
      map[letter] ? `${word} ${map[letter]}` : whole
    );
}

// Reorders the options and leaves every id exactly where it was.
//
// Ids are deliberately NOT reassigned. The revision quiz posts its answers to
// /api/revision/attempt, which grades them against the stored question's
// `correctOptionIds` — renumbering client-side would make the server compare
// against the wrong options and mark right answers wrong. Since the displayed
// letter is positional in every renderer and grading is by id, reordering alone
// is enough; only the prose needs its letters moved to the new positions.
export function shuffleQuestion<T extends ShufflableQuestion>(question: T): T {
  if (!Array.isArray(question.options) || question.options.length < 2) return question;

  const options = shuffled(question.options);

  // The letter a reader saw before -> the letter they see now. Authored and
  // generated questions both use ids "a".."d" in their original order, so an
  // option's id is also the letter it used to occupy.
  const map: Record<string, string> = {};
  options.forEach((option, index) => {
    if (index < LETTERS.length) map[option.id] = LETTERS[index];
  });

  return {
    ...question,
    options,
    explanation: remapLetterRefs(question.explanation, map),
    example: remapLetterRefs(question.example, map),
  };
}

// Mid-lecture quick checks carry `{ text, correct }` with no ids — the correct
// flag travels with the option, so only prose letter references need remapping.
export function shuffleChoices<T extends { text: string; correct: boolean }>(
  choices: T[],
  explanation?: string
): { choices: T[]; explanation?: string } {
  if (!Array.isArray(choices) || choices.length < 2) return { choices, explanation };

  const withIndex = choices.map((choice, index) => ({ choice, index }));
  const order = shuffled(withIndex);

  const map: Record<string, string> = {};
  order.forEach((entry, index) => {
    if (entry.index < LETTERS.length && index < LETTERS.length) {
      map[LETTERS[entry.index]] = LETTERS[index];
    }
  });

  return {
    choices: order.map(entry => entry.choice),
    explanation: remapLetterRefs(explanation, map),
  };
}

// Shuffles are cached per page load: stable while the reader works through the
// quiz (and across unmount/remount as they navigate slides), re-randomised on
// the next refresh, which is exactly the behaviour we want.
const cache = new Map<string, unknown>();

export function shuffleOnce<T>(key: string, build: () => T): T {
  if (!cache.has(key)) cache.set(key, build());
  return cache.get(key) as T;
}
