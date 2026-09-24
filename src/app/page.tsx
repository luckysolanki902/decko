import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Binary,
  Brain,
  Code2,
  Github,
  Layers,
  RotateCcw,
  Smartphone,
  Sparkles,
  TerminalSquare,
  ThumbsUp,
} from 'lucide-react';

import { SiteHeader } from '@/components/SiteHeader';
import { TrackersSection } from '@/components/trackers/TrackersSection';
import { COURSES, COURSE_TOTALS } from '@/data/courses';
import { GITHUB_REPO_URL, SITE_NAME } from '@/lib/site';

const ICONS = { Code2, TerminalSquare, Smartphone, Brain, Binary, BarChart3 };

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen">
        <Hero />
        <Courses />
        <WhyItWorks />
        <LearningLoop />
        <HowRevisionWorks />
        <TrackersSection />
        <OpenSource />
        <Footer />
      </main>
    </>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
          <Sparkles className="h-3 w-3" />
          Free and open source
        </p>

        <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl">
          Learn it. Prove it. Keep it.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--text-secondary)]">
          Free engineering courses that explain every step, quiz you while you learn, and bring the important
          ideas back before you forget them. You always know whether you understood the lesson or only
          recognised the words.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#courses"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90"
          >
            Choose a course
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)]"
          >
            Sign in
          </Link>
        </div>

        <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
          {[
            { value: COURSE_TOTALS.courses, label: 'courses' },
            { value: COURSE_TOTALS.lectures, label: 'lectures' },
            { value: '100.9k', label: 'words' },
            { value: '98', label: 'quiz blocks' },
          ].map(stat => (
            <div key={stat.label}>
              <dt className="text-2xl font-semibold tabular-nums text-[var(--text-primary)] sm:text-3xl">
                {stat.value}
              </dt>
              <dd className="mt-1 text-xs text-[var(--text-tertiary)]">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ── Courses ─────────────────────────────────────────────────────────────────

function Courses() {
  return (
    <section id="courses" className="scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Start where you are
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Every roadmap starts from its stated prerequisites and grows toward real work. This release opens
            all six courses with three reviewed lectures, while the complete planned path stays visible on every roadmap.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map(course => {
            const Icon = ICONS[course.icon];
            return (
              <Link key={course.id} href={course.href} className="group block">
                <article className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-colors hover:border-[var(--border-hover)]">
                  <div className="mb-5 flex items-start justify-between">
                    <Icon className="h-5 w-5" style={{ color: course.accent.light }} />
                    <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-primary)]" />
                  </div>

                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">{course.title}</h3>
                  <p className="mt-0.5 text-sm text-[var(--text-tertiary)]">{course.subtitle}</p>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {course.description}
                  </p>

                  <p className="mt-4 border-t border-[var(--border)] pt-4 text-xs leading-relaxed text-[var(--text-tertiary)]">
                    <span className="font-semibold text-[var(--text-secondary)]">Prerequisites: </span>
                    {course.prerequisites}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Tag>{course.lectures} lectures</Tag>
                    <Tag>{course.days} days planned</Tag>
                    {course.status === 'early' && (
                      <span className="rounded-lg bg-[var(--accent-rose-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-rose-text)]">
                        Early, being written
                      </span>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-[var(--text-tertiary)]">
          Missing a lesson or course?{' '}
          <Link href="/requests" className="font-medium text-[var(--text-primary)] underline underline-offset-4">
            Request it and vote
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg bg-[var(--bg-tertiary)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]">
      {children}
    </span>
  );
}

// ── Why it works ────────────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    title: 'The failure comes before the rule',
    body:
      'You begin with the version a reasonable beginner would write. It works. One realistic change breaks it. The new tool arrives only after you can feel why it is needed, so the rule has somewhere to attach.',
  },
  {
    title: 'One idea per screen',
    body:
      'A screen that makes three points is really three screens. Working memory holds very little at once, so material that arrives in dense blocks is mostly discarded before it is ever understood. Everything here is split until each screen carries exactly one idea.',
  },
  {
    title: 'Nothing borrowed from the future',
    body:
      'Every example is buildable from what came before it. No API appears before it is taught, and nothing is waved away as something to understand later. If a term is needed early, it gets a plain-language detour first rather than a promise.',
  },
  {
    title: 'Recognition is not knowing',
    body:
      'Rereading gets easier because the page becomes familiar. That does not prove the idea is yours. Lectures ask you to predict, trace, answer, and build before the explanation can make the work feel obvious.',
  },
];

function WhyItWorks() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Explanations that do not skip the hard part
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            A subject can be organised neatly and still be taught badly. decko follows the order in which a
            learner can actually build the idea: a concrete problem, a useful mental model, a small example,
            a realistic example, the failure modes, and then practice.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Every lecture has one practical test:{' '}
            <span className="font-medium text-[var(--text-primary)]">
              you should be able to read it from top to bottom without opening another tab to fill in a missing step.
            </span>{' '}
            The rules that enforce that standard are public in the repository and checked before a lecture ships.
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {PRINCIPLES.map((principle, index) => (
            <div key={principle.title}>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-base font-semibold text-[var(--text-primary)]">{principle.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{principle.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Learning loop ──────────────────────────────────────────────────────────

function LearningLoop() {
  const stages = [
    {
      number: '01',
      title: 'Understand',
      body: 'The lecture derives the idea from a problem you can see. Mental models come before syntax, and examples grow one careful step at a time.',
    },
    {
      number: '02',
      title: 'Check it now',
      body: 'Checkpoint quizzes appear between lecture sections. You answer before the explanation, while there is still time to repair the exact idea that did not land.',
    },
    {
      number: '03',
      title: 'Connect the pieces',
      body: 'An end-of-lecture quiz mixes the concepts together. It tests whether the lesson still works when the nearby explanation is no longer doing the thinking for you.',
    },
    {
      number: '04',
      title: 'Remember it later',
      body: 'Revision asks you to recall the idea after a gap. Missed material returns before the session ends, then comes back again after more time has passed.',
    },
  ];

  return (
    <section className="px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">The learning loop</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            The course checks before your confidence gets ahead of you
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            The current library has 61 checkpoint quizzes inside lectures and 18 end-of-lecture quizzes.
            They are not decoration and they are not saved for exam day. They are part of how each idea is taught.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map(stage => (
            <li key={stage.number} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
              <span className="font-mono text-xs text-[var(--text-muted)]">{stage.number}</span>
              <h3 className="mt-3 text-base font-semibold text-[var(--text-primary)]">{stage.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{stage.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── Revision ────────────────────────────────────────────────────────────────

function HowRevisionWorks() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
              <RotateCcw className="h-3 w-3" />
              Revision
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Revision that makes memory do the work
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              A major review of common study techniques gave its strongest rating to two approaches:
              <span className="font-medium text-[var(--text-primary)]"> practice testing</span> and
              <span className="font-medium text-[var(--text-primary)]"> distributed practice</span>. Rereading,
              highlighting, and summarising received much weaker support, even though they are the habits most
              courses leave you with.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Revision here is not another page to consume. It asks before it explains, makes you answer from
              memory, and repeats what you missed before the session closes. The effort is useful because it
              reveals what survived and strengthens your ability to retrieve it again.
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--text-muted)]">
              Dunlosky et al. (2013), <em>Improving Students&rsquo; Learning With Effective Learning
              Techniques</em>; Roediger &amp; Karpicke (2006), <em>Test-Enhanced Learning</em>. The full
              reasoning is in the repo.
            </p>
          </div>

          <ol className="space-y-4">
            {[
              {
                step: 'Orient',
                body: 'Thirty seconds of context so you know what is about to be asked. It gives you a direction without giving away the answer.',
              },
              {
                step: 'Recall',
                body: 'Cards ask first and explain second. You grade yourself honestly, and anything you miss returns before the session closes.',
              },
              {
                step: 'Check',
                body: 'A graded quiz unlocks after recall is complete. You cannot skip straight to recognition and mistake it for memory.',
              },
              {
                step: 'Space it out',
                body: 'History and scores show how long it has been. Returning after a gap gives the next retrieval attempt something meaningful to do.',
              },
            ].map((stage, index) => (
              <li
                key={stage.step}
                className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-xs font-semibold tabular-nums text-[var(--text-secondary)]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{stage.step}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{stage.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <ThumbsUp className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-tertiary)]" />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">
                Nothing is generated while you wait.
              </span>{' '}
              Every lecture and revision set is reviewed and committed before a learner sees it. You get stable
              material that can be corrected for everyone, not a fresh draft generated while you wait.
            </p>
          </div>
          <Link
            href="/requests"
            className="shrink-0 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)]"
          >
            See the board
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Open source ─────────────────────────────────────────────────────────────

function OpenSource() {
  return (
    <section className="border-t border-[var(--border)] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <Layers className="mx-auto h-6 w-6 text-[var(--text-tertiary)]" />

        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Built in private. Opened when the standard held up.
        </h2>

        <p className="mt-5 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          decko ran privately for about eight months before it was opened. Early lectures were too shallow.
          Some examples depended on ideas from later phases. Some paragraphs explained what code did and never
          earned the learner&rsquo;s understanding of why.
        </p>

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Those failures became rules. Phases were reordered, lectures were rebuilt, quizzes moved inside the
          teaching flow, and revision was redesigned around retrieval. The result is not just a large content
          library. It is a public system for producing explanations that can be inspected and improved.
        </p>

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          {SITE_NAME} is free and open source. The application, curriculum, teaching rules, and every lecture
          are available to read, fork, correct, and build on.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90"
          >
            <Github className="h-4 w-4" />
            View the source
          </a>
          <Link
            href="/requests"
            className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)]"
          >
            Suggest a correction
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[var(--text-tertiary)] sm:flex-row">
        <p>
          <span className="font-semibold text-[var(--text-primary)]">{SITE_NAME}</span>, free forever.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link href="/requests" className="transition-colors hover:text-[var(--text-primary)]">
            Requests
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            GitHub
          </a>
          <a
            href={`${GITHUB_REPO_URL}/blob/main/LICENSE`}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            Licence
          </a>
        </div>
      </div>
    </footer>
  );
}
