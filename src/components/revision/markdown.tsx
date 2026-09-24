'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

// Turn heading text into a stable anchor so the reading rail can link to it and
// highlight the section you are actually looking at.
export function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function nodeText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (React.isValidElement(node)) return nodeText((node.props as { children?: React.ReactNode }).children);
  return '';
}

// Shared Markdown rendering for the Revision feature. Lifted from the old daily
// quiz client so recaps, prompts, options, and explanations all render code
// fences, tables, and lists in the same calm palette used across the app.
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mt-6 text-2xl font-semibold leading-tight text-[#171614] first:mt-0 dark:text-[#F4F1EA] md:text-[2rem]">{children}</h1>
  ),
  // A `##` is a lecture boundary — the biggest break in the document, so it gets
  // a rule above it and real space, the way a chapter opening would.
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2
      id={headingSlug(nodeText(children))}
      className="mt-16 scroll-mt-28 border-t border-[#E4E0D6] pt-10 text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-[#171614] first:mt-0 first:border-0 first:pt-0 dark:border-[#1E2024] dark:text-[#EDEFF2] md:text-[1.8rem]"
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3
      id={headingSlug(nodeText(children))}
      className="mt-12 scroll-mt-28 text-[1.22rem] font-semibold leading-snug tracking-[-0.005em] text-[#171614] dark:text-[#E3E7EC]"
    >
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="mt-8 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#8A867C] dark:text-[#7E858F]">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mt-5 text-[1.05rem] leading-[1.85] text-[#3F3A33] first:mt-0 dark:text-[#C6CCD4] md:text-[1.075rem]">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mt-5 list-disc space-y-2.5 pl-5 text-[1.05rem] leading-[1.85] text-[#3F3A33] marker:text-[#B7B1A3] dark:text-[#C6CCD4] dark:marker:text-[#4B535E]">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mt-5 list-decimal space-y-2.5 pl-5 text-[1.05rem] leading-[1.85] text-[#3F3A33] marker:text-[#B7B1A3] dark:text-[#C6CCD4] dark:marker:text-[#4B535E]">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="pl-1">{children}</li>,
  // Traps and gotchas. In dark mode this is the one place colour is allowed to
  // carry meaning, so it stays low-saturation and reads as a held note.
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mt-6 rounded-r-lg border-l-2 border-[#2F9E44] bg-[#F3F6F3] px-5 py-4 text-[1.02rem] leading-[1.8] text-[#4F413A] dark:border-[#3FB950]/70 dark:bg-[#111814] dark:text-[#B9C4BD]">
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children }: { inline?: boolean; className?: string; children?: React.ReactNode }) =>
    inline ? (
      <code className="rounded bg-[#ECEAE3] px-1.5 py-0.5 font-mono text-[0.86em] text-[#1F1B17] dark:bg-[#1A1D21] dark:text-[#D9AF9E]">{children}</code>
    ) : (
      <code className={className}>{children}</code>
    ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="mt-6 overflow-x-auto rounded-xl border border-[#E4E0D6] bg-[#FBFAF6] px-5 py-4 font-mono text-[0.875rem] leading-[1.75] text-[#24292E] dark:border-[#1E2024] dark:bg-[#0B0D0F] dark:text-[#DCE1E7]">
      {children}
    </pre>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="mt-6 overflow-x-auto rounded-xl border border-[#E4E0D6] dark:border-[#1E2024]">
      <table className="min-w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => <thead className="bg-[#F1EFE8] dark:bg-[#121417]">{children}</thead>,
  tbody: ({ children }: { children?: React.ReactNode }) => <tbody>{children}</tbody>,
  tr: ({ children }: { children?: React.ReactNode }) => <tr className="border-t border-[#E6DFD3] dark:border-[#1E2024]">{children}</tr>,
  th: ({ children }: { children?: React.ReactNode }) => <th className="px-4 py-3 font-semibold text-[#171614] dark:text-[#EDEFF2]">{children}</th>,
  td: ({ children }: { children?: React.ReactNode }) => <td className="px-4 py-3 text-[#3F3A33] dark:text-[#C6CCD4]">{children}</td>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold text-[#171614] dark:text-[#EDEFF2]">{children}</strong>,
  em: ({ children }: { children?: React.ReactNode }) => <em className="italic text-[#5A5147] dark:text-[#B3BAC3]">{children}</em>,
  hr: () => <hr className="mt-10 border-0 border-t border-[#E4E0D6] dark:border-[#1E2024]" />,
};

// `md-code-surface`: the <pre> owns the code block's background and padding, so
// globals.css strips the highlight.js background off the <code> inside it.
// Without that, `.hljs` paints a second, unpadded rectangle within the padded
// <pre> — a visible slab inset inside the block.
export function MarkdownBlock({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`md-code-surface ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkHardBreaks]} rehypePlugins={[rehypeHighlight]} components={markdownComponents}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Quiz text
// ────────────────────────────────────────────────────────────────────────────

type MdNode = { type: string; value?: string; children?: MdNode[] };

// Treat a single newline as a hard line break, the way chat and issue trackers
// do. Quiz prompts and options are frequently short code or program output
// ("0\n12"), and CommonMark would otherwise reflow those onto one line — the
// reader sees "0 12" and cannot tell it was two lines. Only `text` nodes are
// rewritten, so fenced and inline code are left untouched.
function remarkHardBreaks() {
  return (tree: MdNode) => {
    const walk = (node: MdNode) => {
      if (!node.children) return;
      node.children = node.children.flatMap(child => {
        if (child.type === 'text' && child.value?.includes('\n')) {
          const parts = child.value.split('\n');
          const out: MdNode[] = [];
          parts.forEach((part, i) => {
            if (i > 0) out.push({ type: 'break' });
            if (part) out.push({ type: 'text', value: part });
          });
          return out;
        }
        walk(child);
        return child;
      });
    };
    walk(tree);
    return tree;
  };
}

// Compact variant used inside quiz cards and option buttons. Same rules as
// MarkdownBlock, but with margins tuned for a dense card rather than a page:
// paragraphs sit close together and code fences stay inline-sized so a
// four-line snippet does not dwarf the option it belongs to.
const quizMarkdownComponents = {
  ...markdownComponents,
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mt-2.5 leading-7 first:mt-0">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mt-2.5 list-disc space-y-1 pl-5 leading-7 first:mt-0">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mt-2.5 list-decimal space-y-1 pl-5 leading-7 first:mt-0">{children}</ol>
  ),
  code: ({ inline, className, children }: { inline?: boolean; className?: string; children?: React.ReactNode }) =>
    inline ? (
      <code className="rounded-sm bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.88em] dark:bg-white/[0.09]">{children}</code>
    ) : (
      <code className={`${className || ''} font-mono text-[13px] leading-[1.65]`}>{children}</code>
    ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="mt-2.5 overflow-x-auto rounded-lg border border-black/[0.08] bg-[#F7F6F1] px-3.5 py-2.5 font-mono text-[13px] leading-[1.65] text-[#24292E] first:mt-0 dark:border-white/[0.08] dark:bg-[#0C0C0E] dark:text-[#E6E6E3]">
      {children}
    </pre>
  ),
};

export function QuizMarkdown({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`md-code-surface ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkHardBreaks]}
        rehypePlugins={[rehypeHighlight]}
        components={quizMarkdownComponents}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

// Option buttons are already a card sitting on the page, and they carry their
// own state colour (selected, correct, wrong). A code fence inside one must not
// paint its own surface — that stacks a second slab inside the first and fights
// whatever colour the option is currently wearing. So here a fence is just
// monospace text on the option's background, and inline code is a faint tint.
const quizOptionComponents = {
  ...quizMarkdownComponents,
  code: ({ inline, className, children }: { inline?: boolean; className?: string; children?: React.ReactNode }) =>
    inline ? (
      <code className="rounded-sm bg-black/[0.06] px-1 py-0.5 font-mono text-[0.9em] dark:bg-white/[0.1]">{children}</code>
    ) : (
      <code className={`${className || ''} bg-transparent p-0 font-mono text-[13.5px] leading-[1.6]`}>{children}</code>
    ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-0 overflow-x-auto bg-transparent p-0 font-mono text-[13.5px] leading-[1.6] text-inherit">
      {children}
    </pre>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mt-1.5 leading-7 first:mt-0">{children}</p>
  ),
};

export function QuizOptionMarkdown({ text, className = '' }: { text: string; className?: string }) {
  // `quiz-option-md` lets globals.css strip the highlight.js theme background,
  // which is imported after Tailwind and would otherwise win over any utility.
  return (
    <div className={`quiz-option-md ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkHardBreaks]}
        rehypePlugins={[rehypeHighlight]}
        components={quizOptionComponents}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
