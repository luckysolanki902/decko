# Revision Sets — Authoring Rules

These govern the revision sets served by the revision dashboard. Sets are drafted
against these rules, reviewed, and stored in the `revision_content` collection;
nothing is generated at runtime. They are separate from the lecture rules in
[`teaching-method.md`](teaching-method.md) because a revision has a different
job: a lecture *teaches* an idea for the first time; a revision *retrieves* an
idea the learner already met.

When a target has no set yet, the app does not fabricate one. It shows a vote
button instead, and the most-wanted sets are written first.

## The one rule everything follows from

**A revision is not a document to read. It is a set of retrieval cues.**

In the largest synthesis of study techniques ([Dunlosky et al., 2013](https://gwern.net/doc/psychology/spaced-repetition/2013-dunlosky.pdf)),
only two of ten techniques earned a **high** utility rating:

| Rating | Techniques |
|---|---|
| **High** | practice testing, distributed practice |
| Moderate | interleaved practice, elaborative interrogation, self-explanation, imagery |
| **Low** | **rereading**, **highlighting**, **summarisation**, mnemonics |

A recap can support orientation and correction, but rereading it is not a substitute
for retrieval. Dunlosky's low-utility ratings are broad judgments about evidence and
conditions, not a claim that all summaries are useless. Fluency from re-exposure can
feel like knowing. Roediger and Karpicke found delayed-retention benefits from testing
in prose-learning experiments; do not generalize a single percentage to programming.

So: **the depth goes in the answer, not in a document.** The learner earns each
explanation by attempting the question first.

## What the psychology does — and does not — justify

Use learning research as a design constraint, not as decoration added after the
cards are written.

- **Retrieval must require production.** Seeing an answer and thinking “I knew
  that” is recognition. A cue should make the learner predict an output, recover
  a mechanism, choose between close approaches, or reconstruct a small piece of
  code before reveal. Practice testing has strong evidence for later retention;
  this does not mean that any question-shaped sentence is useful retrieval.
- **Feedback must repair the attempted model.** The answer arrives immediately
  after an attempt and explains the causal chain the learner should have
  produced. Generic advice about studying, confidence, or trying again is not
  feedback on the topic and must not appear as padding.
- **Useful difficulty is targeted difficulty.** A short, achievable attempt
  before feedback can strengthen learning. Confusing wording, missing
  prerequisites, unexplained syntax, and prolonged guessing are merely bad
  instruction. Productive failure requires an accessible problem followed by
  explicit consolidation.
- **Interleaving should force selection.** Later cards and the quiz mix lectures
  so the learner must decide which known rule applies. Interleaving is not random
  disorder: do not mix material whose prerequisites have not been taught.
- **Spacing is a return policy, not a magic timetable.** Revisit after a gap and
  shorten the gap after a miss. Approximate 1/3/7/14/30-day intervals are a
  practical default, not a research-proven schedule for every programming skill.
- **Recall and transfer are different evidence.** Reconstructing a familiar
  explanation shows recall. Applying it after one meaningful detail changes
  shows transfer. Include both, but never claim that one successful card or MCQ
  proves independent skill.
- **Confidence follows evidence.** “Got it” should mean the learner produced the
  central mechanism before reveal, not that the revealed prose felt familiar.
  A shaky or missed card returning later in the same session is useful feedback,
  not punishment.

Beginners also benefit from worked examples. A revision may show a compact trace
or corrected example on the back because the learner has already attempted the
cue. Do not demand that a novice invent syntax or a method that the lectures did
not teach.

## Budget

A revision covers one group of lectures and must fit **about 20 minutes**.

- **One card per lecture topic.** A 3-lecture revision has ~12 cards.
- **`back` is 130–220 words.** Long enough to carry the mechanism and the code,
  short enough to read in under a minute.
- **Orientation is ≤150 words.** A signpost, not a summary; no code.
- **Quiz is 12 questions.**

12 cards × ~60s + a 12-question quiz ≈ 20 minutes. If a revision needs more than
that, it is covering too many lectures — split the target, don't lengthen the
session.

## Writing a card

**`front` — the cue.** A question the learner answers from memory in ~30
seconds. Prefer questions with moving parts over questions that ask for a label:

- ✅ "Why does mutating props during render break React's update model?"
- ✅ "Predict what this prints, and say why." + a short fenced snippet
- ✅ "Which of these two `useEffect` dependency arrays is right here, and why?"
- ❌ "What are keys?" — asks for a label; the answer is a word, not a mechanism
- ❌ "Explain useState." — too broad to attempt in 30 seconds

Framing the cue as **why / what breaks / predict** is elaborative interrogation
and self-explanation, both rated moderate utility on their own and free here.

**`back` — the feedback.** This is where the depth lives, and it is read at the
moment feedback does the most work — right after an attempt.

1. The **mechanism** in 2–4 sentences: how it actually works.
2. The **rule**, precise enough to act on.
3. The **code**, where the lecture uses code — fenced, with a language tag. Where
   the lecture contrasts broken against fixed, show both and say what changed.
4. The **trap** as a `>` blockquote naming the specific mistake and its cause.

**Never write a back that restates the front.** If the front asks *why* render
must stay pure, the back explains what React does with the return value and what
breaks if you mutate — not "because render must be pure".

### One card is authored from one real topic

Do not manufacture cards by slicing final-quiz questions. A lecture quiz checks
one misconception in a compact form; its explanation is rarely a complete
retrieval-card answer. Instead:

1. Open the full lecture and choose one of its actual topic-sized ideas.
2. Identify the decision, prediction, or failure that reveals understanding.
3. Write the front without looking at the lecture wording.
4. Write the back from the relevant lecture screens: mechanism → rule → concrete
   example or trace → precise trap.
5. Check every noun, API, and syntax feature against Days 1 through the target
   day. Remove forward references.
6. Read the front alone and attempt it. Then read the back as a learner who got
   it wrong. If the back does not diagnose and repair that error, rewrite it.

`lectureTitle` and `topicTitle` must name the source accurately. Labels such as
“Day 2 retrieval” are not acceptable provenance.

### Forbidden filler

The word budget is a ceiling and depth target, never permission to pad. Delete
sentences that could be pasted unchanged onto a card from another course.

Forbidden patterns include:

- “reconstruct the cause-and-effect chain” without naming that chain;
- “change one detail and see what happens” without specifying the detail and
  expected consequence;
- “recognising is not producing” repeated on individual cards;
- generic encouragement, study instructions, or self-grading advice on the
  answer side;
- an **Answer:** line followed by a lightly expanded multiple-choice option.

Session-level advice belongs in the orientation or interface. Every sentence on
a card back must teach, exemplify, contrast, or debug that card's topic.

### Card quality test

A card is ready only when all answers are yes:

- Could the learner make a concrete attempt in about 30 seconds?
- Does the back explain why, not merely state what?
- Is the rule precise enough to use on a changed example?
- Does any code compile/run in the learner's current environment, or is a
  fragment explicitly identified?
- Is the trap a real mistake with a named cause?
- Would removing any paragraph make the topic explanation meaningfully weaker?
- Is every sentence specific enough that it could not be reused unchanged on an
  unrelated card?

## What the session does with the cards

Implemented in `src/components/revision/RecallSession.tsx`; authors don't control
it, but the cards have to suit it:

- The learner sees `front` **alone**, attempts it, then reveals `back`.
- They self-grade **missed / shaky / got it**.
- Anything short of *got it* is requeued and repeats before the session ends
  (Leitner-style, within the session).
- Later rounds **interleave** across lectures rather than replaying in order.
- Progress is shown as a **mastery tally** (how many concepts are secure), never
  as a position bar — position through a document is not what progress means
  when the goal is retrieval.

## Scope

Unchanged from the lecture rules, and enforced in `buildScopeRules`: build only
from the supplied lecture text plus obviously-earlier fundamentals. Never
reference a library, syntax, tool, or concept from a later day — not in a code
comment, not in a wrong answer.

## Quiz

See [`quiz-blocks.md`](quiz-blocks.md) for the shared quiz rules, including the
answer-position balance rule and the ban on referring to an option by its letter.
Revision quizzes additionally: interleave across all the lectures in the target,
and favour reading code, predicting output, and spotting the bug over recall of
terminology.

The quiz is authored independently from the cards. It may test the same
mechanism through a changed example, but must not copy the card front and turn
its back into four options. Across 12 questions include:

- coverage of every lecture in the target;
- several code/output or trace questions where the course uses code;
- at least two boundary or failure cases;
- at least two changed-context selection questions;
- plausible distractors tied to mistakes named in the lectures.

Review the answer explanations with the same standard as card backs: each must
explain the mechanism and the tempting error, not merely announce the key.

## Authoring and publishing workflow

Revision content is authored offline and committed or reproducibly seeded. It is
never generated in response to a learner opening the page.

1. Read all target lectures completely, including neighbouring-day checks where
   the topic could conflict.
2. Make a coverage table: four topic-sized cards per lecture and the quiz ideas
   that will test them under changed conditions.
3. Draft the 12 cards topic by topic from full lecture text.
4. Draft the 12-question quiz independently and balance correct-answer sets.
5. Run structural validation and the forbidden-filler search.
6. Read every card in the actual recall UI: front alone, reveal, then grading
   controls. Check code fences, scrolling, and mobile width.
7. Publish a new immutable version. Never silently replace content that has
   completed attempts attached; history must remain replayable.

The review is a reading, not a count. Twelve cards of the right length can still
be twelve bad cards.

## Sources

- [Dunlosky et al. (2013), *Improving Students' Learning With Effective Learning Techniques*](https://gwern.net/doc/psychology/spaced-repetition/2013-dunlosky.pdf)
- [Roediger & Karpicke (2006), *Test-Enhanced Learning*](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2006.01693.x/)
- [Bjork & Bjork, *Introducing Desirable Difficulties Into Practice and Instruction*](https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-introducing-desirable-difficulties-into-practice-and-instruction-bjork-and-bjork.pdf)
- [Pretesting / errorful generation — the benefit of attempting before being told](https://pmc.ncbi.nlm.nih.gov/articles/PMC9839203/)
- [IES practice guide — alternate worked examples with problem solving](https://ies.ed.gov/ncee/wwc/practiceguide/1)
- [Sinha & Kapur — productive failure meta-analysis](https://journals.sagepub.com/doi/abs/10.3102/00346543211019105)
- [Cepeda et al. — spacing depends on the desired retention interval](https://laplab.ucsd.edu/articles/Cepeda%20et%20al%202008_psychsci.pdf)
- [Deslauriers et al. — perceived learning can diverge from measured learning](https://www.pnas.org/doi/full/10.1073/pnas.1821936116)
