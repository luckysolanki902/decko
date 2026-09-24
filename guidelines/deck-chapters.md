# Deck Chapters (how the lecture deck groups its screens)

Applies to every roadmap rendered by `src/components/LectureDeck.tsx`: **webd, daml, ml, go, dsa, and reactnative**.

A 19-screen deck used to read as one intimidating run: the counter said `14 / 19` even though the teaching had ended at screen 13 and everything left was practice and reference. The deck now groups screens into **chapters** and shows them as a segmented progress rail, a chapter-relative counter (`Review · 1 / 2`), and a card on the first screen of each new chapter that names the boundary out loud.

Nothing in the markdown declares a chapter. The split is inferred from the `##` headings lectures already use — which makes **section naming load-bearing**. This file is the contract.

---

## The four chapters

| Chapter | What it holds | How its start is found |
|---|---|---|
| **Lecture** | The teaching. Always starts at screen 1. | Default. |
| **Practice** *or* **Review** | Everything from where teaching stops up to, but not including, the reference tail. Named for whichever family opened it. | First screen whose heading matches a practice opener (any position) or a review opener (back half only). |
| **Wrap-up** | The reference tail. | The unbroken run of reference headings immediately before the final quiz. |
| **Quiz** | The ` ```finalquiz ` screen. | Exact — the quiz is a screen kind, not a heading. |

Only chapters that hold at least one screen are shown. The segmented rail appears only when the deck has two or more chapters. A deck with no detected split stays one Lecture chapter and keeps the flat progress bar. A practice-only deck whose opener is on screen one also keeps the flat bar because its one detected chapter is Practice; that is a successful match, not a failure.

Implementation: `buildChapters()` in `src/components/LectureDeck.tsx`. If you change the vocabulary below, change it there too.

---

## The heading vocabulary

The matcher reads each screen's first `##` (falling back to its first `###`), strips leading emoji and ordinals — `## 9. Hands-on build:`, `## 💪 Practice Exercises` — and matches the start of what's left, case-insensitively.

**Practice openers** — "now you do it". Matched at *any* position, because a practice day starts handing out tasks on screen two:

`Hands-on…` · `Your turn…` · `Practice…` · `Task 1 …` · `Problem 1 …` · `App 1 …` · `Exercise(s)…` · `Challenge…` · `Mini-project…` · `Workshop…` · `Drill…` · `Do it yourself…` · `Build it yourself…` · `Let's build…`

**Review openers** — "now consolidate it". Only trusted in the **back half** of the deck, so a mid-lecture `## Common mistakes with the event object` can't cut the teaching in two:

`Common mistakes…` · `Mistakes…` · `Gotchas…` · `Pitfalls…` · `Debugging…` · `Debug map…` · `Troubleshooting…` · `Interview…` · `Check your understanding…` · `Self-check…` · `Review your work…` · `Test yourself…`

**Reference tail (Wrap-up)** — counted only as an unbroken run ending at the quiz:

`Cheat sheet…` · `Quick/Command/API/Full reference…` · `Recap…` · `Summary…` · `Key takeaways…` · `What's next…` · `What comes next…` · `What you should now understand…` · `Tomorrow…` · `Wrap-up…` · `Next up…` · `Further reading…` · `Resources…` · `Going further…` · `Where to go…`

Quick-check ` ```quiz ` screens carry no heading; they simply belong to whichever chapter surrounds them.

---

## Authoring rules

1. **Put the recognised opener exactly where the teaching stops.** The screen carrying it is where the learner sees "That was the lecture — practice starts here." If that card lands on a screen that still teaches something new, the heading is in the wrong place.

2. **Don't teach new material after the opener.** Everything from that heading up to, but not including, the reference tail is one Practice/Review chapter, presented as "no new concepts from here on". The reference tail becomes its own Wrap-up chapter. Move any remaining teaching above the opener.

3. **A lecture with no build section is fine.** React concept lectures (Phase 4) deliberately carry no hands-on build — their boundary falls on `## Common mistakes`, the chapter is labelled **Review**, and the card reads "review starts here". This is intended, not a fallback to fix.

4. **Keep the reference tail contiguous.** `Cheat sheet` → `Tomorrow` → final quiz reads as a two-screen Wrap-up. Slipping a non-matching heading into that run (`## Pro tips`) truncates the chapter at that point — everything above it falls back into Practice/Review.

5. **Never use a practice or review opener as a teaching heading.** `## Practice makes the closure obvious` or `## Hands-on with the event object` mid-lecture will cut the deck early and mislabel the rest. Rename the teaching screen; these words are reserved.

6. **Practice-set lectures are expected to be lopsided or unsplit.** A deck of `## App 1 …` / `## Task 1 …` screens is Practice from screen one, and a short one (three apps, no framing screen, no quiz) is a single chapter and keeps the flat bar. Both are correct shapes for a practice deck, not detection bugs.

7. **Chapter labels are fixed** (`Lecture`, `Practice`, `Review`, `Wrap-up`, `Quiz`). Don't try to invent a chapter by inventing a heading; add the heading to the vocabulary in `buildChapters()` if a genuinely new section type appears.

---

## Verify it

Add to the usual per-lecture check: open the deck and read the rail under the top bar.

- The **Lecture** track should end where the teaching ends — compare it against the `## ` headings in the file.
- The chapter counter, top right, should read `Lecture · 4 / 15`-style, not a running deck total.
- The boundary card should appear once, on the first screen after the teaching, and say the right thing (`practice starts here` for a build/task section, `review starts here` for a mistakes/reps section).
- The rail's segments are clickable — each jumps to its chapter's first screen.

A concept deck that should have multiple chapters but shows the flat bar matched no usable split: check whether its tail sections use the vocabulary above. A short practice-only deck that starts at `App 1`, `Task 1`, or another recognised practice opener correctly has one Practice chapter and therefore also shows the flat bar.
