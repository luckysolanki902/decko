# DAML Lecture Style Guide — Legacy Structure Reference

This file defines the canonical style for all DAML lecture files. Follow it whenever creating or rewriting a DAML lecture. The gold-standard reference is `public/data/lectures/daml/phase0/day01-git-basics.md`.

> **This file covers *structure* only.** For *how to explain* — failure-first derivation, examples built only from already-taught material, unpacking instead of compressing, tracing concrete values, and not overstating claims — read [`guidelines/teaching-method.md`](teaching-method.md) first. It applies to every roadmap, DAML included. A lecture can satisfy every heading and length rule below and still be unusable if it asserts conclusions the learner has no way to reconstruct.
>
> The two rules most often missed here: **the Learning Objectives list must use vocabulary the learner already has** (name the outcome, not the API), and **a prerequisite check is a reading rather than a grep** — finding a term in an earlier day proves the string exists, not that it was taught.

---

## File Basics

- **Path:** `public/data/lectures/daml/<phaseN>/dayNN-kebab-slug.md`
- **Naming:** `day79-what-is-a-database.md` — day number zero-padded to two digits, 3–6 word slug
- **One file per day.** Never "Day 1-3 combined." Each day is self-contained.
- **Length target:** 500–700 lines. Under 400 is too thin. Over 750 needs pruning.

---

## Required Structure (in order)

Every file must contain these sections in this order:

### 1. H1 Title
```markdown
# Day N: Headline (4–7 words)
```

### 2. One-line meta
```markdown
**⏱️ Duration: X hours | Focus: keyword, keyword, keyword**
```

### 3. Learning Objectives
```markdown
## 🎯 Learning Objectives

By the end of today, you will:
- ✅ [verb phrase]
- ✅ [verb phrase]
... (5–8 bullets, start with action verbs)
```

### 4. Body Parts (3–6 total)

Label each part with an appropriate emoji prefix:
- `## 📖 Part N: Title` — theory / mental models
- `## 🛠️ Part N: Title` — hands-on commands
- `## 🎮 Part N: Title` — pure exercise / practice blocks (optional)

**Each part:** Minimal prose → code block → expected output → short explanation.

### 5. Practice Challenges
```markdown
## 🏋️ Practice Challenges

### Challenge 1: [Theme]
1. [specific task]
2. [specific task]
3. [specific task]
```
3 challenges, each with 3 tasks. No solutions in the file.

### 6. Self-Check Quiz
```markdown
## ✅ Self-Check Quiz

1. Question?
2. Question?
... (exactly 10 questions, no answers inline)
```

### 7. Command Reference / Quick Reference
```markdown
## 📚 Command Reference

\`\`\`sql
-- categorized cheatsheet
\`\`\`
```

### 8. Day Summary
```markdown
## 🎯 Day N Summary

**You've done:**
- ✅ [accomplishment]
...

**Tomorrow:** [one-line preview of next topic]
```

### 9. Pro Tips
```markdown
## 💡 Pro Tips

1. **Bold label:** explanation
... (5+ tips)
```

### 10. Resources
```markdown
## 🔗 Additional Resources

- [link](https://example.com)
- Ask AI well: _"prompt template"_
```

### 11. Quiz Answers
```markdown
## Quiz Answers

1. [answer + brief reason]
... (10 numbered answers)
```

### 12. Final teaser line
```markdown
_Tomorrow: [short description of next topic]._
```

---

## Writing Style Rules

### Mental model first
Open every theory section with the "why" before the "how." One concrete analogy or ASCII diagram before any syntax.

```markdown
## 📖 Part 1: What Is X?

[2–3 sentence analogy that connects to something the learner already knows]

[ASCII diagram if spatial/structural]

[Then: syntax]
```

### Show expected output after every command
Every SQL block that produces rows must be followed by the actual output:

```sql
SELECT count(*) FROM orders;
```

Output:
```
 count
───────
     9
(1 row)
```

This is non-negotiable. Without output, the learner has no way to know if their result is right.

### Numbered sequential exercises
Don't restart numbering in each Part. Number exercises 1, 2, 3... across the whole file. Each exercise is a concrete query to type and run.

```markdown
### Exercise 3: Order By Multiple Columns

\`\`\`sql
SELECT ...
ORDER BY col1 ASC, col2 DESC;
\`\`\`
```

### ❌/✅ failure mode patterns
Whenever a footgun exists, show it:

```markdown
\`\`\`sql
-- ❌ Wrong: alias used before it's defined
SELECT price * 1.1 AS new_price
WHERE new_price > 5000;

-- ✅ Right: repeat the expression
WHERE price * 1.1 > 5000;
\`\`\`
```

### Inline Pro Tips
Use `**💡 Pro Tip:**` callouts inside sections, at the point of relevance:

```markdown
**💡 Pro Tip:** LIMIT without ORDER BY gives you arbitrary rows. Always pair them.
```

### One-line callback
Open the first paragraph (or the subtitle line after the H1) with a reference to yesterday:

```markdown
Yesterday you learned to filter rows with WHERE. Today you control their order and limit how many you see.
```

---

## Code Block Rules

- Always specify the language: ` ```sql `, ` ```bash `, ` ```python `
- Real, runnable snippets only. No `...` placeholders unless the surrounding code was already written earlier in the same lecture.
- SQL keywords: UPPERCASE. Column/table names: lowercase with underscores.
- Comments inside code use `-- ` prefix.

---

## Pedagogy Rules

1. **Teach approach, not facts.** Show the thinking process: "When I see X problem, I reach for Y tool."
2. **Connect every new idea to the previous day.** Open with the callback.
3. **No solution dumps for projects.** Practice Challenges describe what to do, never the code.
4. **Prefer one strong example over three weak ones.**
5. **Ask AI well, but don't let AI write the code.** Teach learners how to prompt effectively, but the exercises must be done by the learner.

---

## Tone

- Second person ("you"), direct, peer-to-peer.
- Slightly playful but not hyped. No "Amazing!" or "Congratulations!"
- No filler intros: never start with "In this lecture, we will learn..."
- The section emoji markers (🎯, 📖, 🛠️, 💡, etc.) are structure markers — use only the ones listed above, not random emoji decoration.

---

## Length Calibration

| Section | Typical length |
|---|---|
| Learning Objectives | 8–12 lines |
| Each body Part | 40–80 lines |
| Practice Challenges | 20–30 lines |
| Quiz | 12 lines |
| Command Reference | 20–35 lines |
| Day Summary | 12–18 lines |
| Pro Tips | 15–20 lines |
| Resources | 5–8 lines |
| Quiz Answers | 20–30 lines |

Total: 500–700 lines. If you're under 400, add exercises. If over 750, cut explanation prose.

---

## What This Style Produces (vs Terse Style)

| Terse (avoid) | Phase0 style (target) |
|---|---|
| 260–300 lines | 500–700 lines |
| No exercise numbering | Sequential Exercise 1, 2, 3... |
| No expected output shown | Every query followed by output block |
| No ❌/✅ patterns | ❌ wrong → ✅ right for every footgun |
| No Practice Challenges | 3 challenges × 3 tasks |
| No Day Summary section | Day Summary with You've Done checklist |
| No Pro Tips section | 5+ Pro Tips in dedicated section |
| No Resources section | Resources with Ask AI well prompt |
| Quiz with no answers | Full Quiz Answers with reasons |
| No final teaser line | Italic teaser closing the file |
