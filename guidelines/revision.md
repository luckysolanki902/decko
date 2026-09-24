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

## Sources

- [Dunlosky et al. (2013), *Improving Students' Learning With Effective Learning Techniques*](https://gwern.net/doc/psychology/spaced-repetition/2013-dunlosky.pdf)
- [Roediger & Karpicke (2006), *Test-Enhanced Learning*](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2006.01693.x/)
- [Bjork & Bjork, *Introducing Desirable Difficulties Into Practice and Instruction*](https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-introducing-desirable-difficulties-into-practice-and-instruction-bjork-and-bjork.pdf)
- [Pretesting / errorful generation — the benefit of attempting before being told](https://pmc.ncbi.nlm.nih.gov/articles/PMC9839203/)
