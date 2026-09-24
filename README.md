<div align="center">

# decko

**Learn deeply. Prove it. Keep it.**

Free, open source engineering courses built around clear explanations, real projects, in-lecture quizzes, and retrieval practice.

[![Live](https://img.shields.io/badge/live-decko.vercel.app-1A1A19?style=flat-square)](https://decko.vercel.app)
[![Courses](https://img.shields.io/badge/courses-6-6889A6?style=flat-square)](#courses)
[![Lectures](https://img.shields.io/badge/launch_lectures-18-5D8E72?style=flat-square)](public/data/lectures)
[![Words](https://img.shields.io/badge/words-100%2C858-B87D6C?style=flat-square)](public/data/lectures)
[![Quiz blocks](https://img.shields.io/badge/quiz_blocks-98-6366F1?style=flat-square)](public/data/lectures)

[Start learning](https://decko.vercel.app) · [Choose a course](#courses) · [Generate a new course](guidelines/course-generation.md) · [Read the teaching standard](AGENTS.md)

</div>

## Finishing is not the same as learning

Most courses make progress easy to measure and understanding easy to assume. You watch the explanation, recognise the next step, and reach the end. Then the blank editor asks you to produce the idea without the instructor and the confidence disappears.

decko is designed for that moment.

Every lecture follows a learning loop:

1. See a concrete problem.
2. Predict what will happen.
3. Build a mental model before learning syntax.
4. Watch the obvious solution fail under a realistic change.
5. Learn the mechanism that repairs the failure.
6. Answer quizzes inside the lecture while the idea is still fresh.
7. Build a useful artifact and test a changed requirement.
8. Return later through retrieval-based revision.

The goal is not to help you recognise more words. The goal is to help you explain, build, debug, and remember without the page doing the thinking for you.

## Quizzes are part of the lesson

The launch library contains **80 checkpoint quizzes inside lectures** and **18 end-of-lecture quizzes**.

A checkpoint appears immediately after the concept it tests. You commit to an answer before feedback appears, so a weak mental model is caught while it can still be repaired. The final quiz mixes ideas from the whole lecture and checks whether they still connect when the nearby explanation is gone.

| Learning layer | What it reveals |
|---|---|
| Prediction before execution | Whether your model can forecast behaviour |
| In-lecture quiz | Whether the current concept is retrievable |
| Deliberate failure | Whether you understand the boundary of the approach |
| Changed project requirement | Whether knowledge transfers beyond the example |
| Final quiz | Whether the lecture works as a connected whole |
| Spaced revision | Whether the idea survives after time passes |

## Explanations earn every rule

decko does not begin with a polished rule and ask you to memorise it.

The lecture first shows the version a reasonable beginner would write. That version works in a small case. One realistic change exposes its hidden assumption. The proper tool arrives only after you can see the exact problem it solves.

| Standard | Promise |
|---|---|
| Failure before rule | You feel the need before receiving the abstraction. |
| Mental model before syntax | You can predict the tool instead of only copying it. |
| Nothing borrowed from the future | Examples use only ideas already taught. |
| Recall over recognition | You predict, trace, answer, reconstruct, and build. |

The full standard is public in [`guidelines/teaching-method.md`](guidelines/teaching-method.md). Quiz structure is defined in [`guidelines/quiz-blocks.md`](guidelines/quiz-blocks.md).

## Courses

This release starts every course with three reviewed lectures. Each roadmap continues far beyond the launch batch, with capability goals, original projects, evidence gates, and prerequisite order specified for every planned day.

| Course | What it covers | Prerequisite | Launch lectures | Planned units |
|---|---|---|---:|---:|
| Web Development | HTML, CSS, JavaScript, TypeScript, React, APIs, databases, security, cloud, and production | None | 3 | 162 |
| Python & Data Analytics | Python, NumPy, Pandas, Excel, SQL, statistics, experiments, Tableau, and analytical communication | None | 3 | 144 |
| Go Engineering | Go fundamentals, domain modelling, concurrency, testing, services, PostgreSQL, containers, and production | Basic programming recommended | 3 | 55 |
| DSA with C++ | C++ from zero through advanced data structures, algorithms, and contest craft | None | 3 | 146 |
| ML, DL & GenAI | Classical ML, deep learning, vision, NLP, LLMs, RAG, agents, generative systems, and MLOps | Python & Data Analytics first | 3 | 228 |
| React Native | Native UI, navigation, offline data, device capabilities, accessibility, testing, modules, and store delivery | JavaScript and React first | 3 | 57 |

Machine learning appears only in the ML course. Python & Data Analytics stays focused on Python, data libraries, SQL, statistics, visualization, BI, and defensible analysis.

## Projects create visible wins

Every phase produces a substantial artifact, and the first visible result arrives on Day 1. Later requirements force the learner to deepen the same mechanism instead of abandoning it for another tutorial.

Projects are not cosmetic clones. They vary in domain, data shape, user, constraint, and evidence. Examples include a Neighborhood Resource Portal, a Cooling-Centre Access Brief, a Trail Ration Planner, a Community Tool Library API, a Pocket Plant Care Board, and the Lantern Live Festival Companion.

A project is complete only when the learner can:

- explain the mechanism without reading the example;
- predict and test a boundary case;
- diagnose one deliberate failure;
- rebuild the critical path after help is removed;
- satisfy a changed requirement using the same underlying idea.

## Revision makes memory work

Rereading feels easier because the page becomes familiar. Familiarity is not proof that the idea can be produced later.

decko revision asks before it explains. Missed material returns within the session, and important ideas come back after a gap. The product is shaped by research on practice testing, distributed practice, desirable difficulties, worked examples, and productive failure. The research informs the design, while the syllabus decides the exact teaching order.

## Create a new course with AI

Cloning the repository gives you the same course-generation system used here.

Start with [`guidelines/course-generation.md`](guidelines/course-generation.md). It explains how to research a field, define prerequisites, build a dependency graph, design an original project ladder, create early visible wins without losing depth, write evidence gates, and keep every data surface synchronized.

Then read the relevant course guideline and [`guidelines/lecture-generation.md`](guidelines/lecture-generation.md). The deployed app performs no runtime AI generation. Lectures are authored, reviewed, validated, and committed before learners see them.

## Run locally

Requirements: Node.js 20 or newer and MongoDB.

```bash
git clone https://github.com/luckysolanki902/decko.git
cd decko
npm ci
cp .env.example .env.local
npm run dev
```

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Session signing secret with at least 32 characters |
| `MONGODB_DB` | No | Database name, defaults to `decko` |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for metadata, OG images, and sitemap |

```bash
npm run validate:quizzes
npm run typecheck
npm run lint
npm run build
npm run stats
```

## Repository map

```text
public/data/lectures/                 Reviewed lecture Markdown
src/data/phases/                      Structured roadmap data
src/data/syllabus/                    Human-readable syllabus and handoff docs
src/components/LectureDeck.tsx        Shared modern lecture reader
src/app/                              Pages, metadata, OG images, sitemap, and APIs
guidelines/                            Teaching and generation standards
docs/research/                         Curriculum and learning-science research
scripts/                               Content generation and validation tools
```

## Contributing

Read [`AGENTS.md`](AGENTS.md) before changing course content and [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a contribution.

A precise correction is valuable. If a lecture is vague, incorrect, or depends on something never taught, report the exact file and heading. If a course is missing, use the public generation guideline to design it to the same standard.

## Licence

- Code: [MIT](LICENSE)
- Course content: [CC BY-SA 4.0](LICENSE-CONTENT)

The content licence covers `public/data/lectures/`, `src/data/syllabus/`, and `guidelines/`.
