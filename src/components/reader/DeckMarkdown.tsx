'use client';

import { Children, ReactNode, isValidElement, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy, ExternalLink } from 'lucide-react';

// The reading surface shared by the lecture deck and the revision deck. Both
// readers render the same kind of material — prose, code, callouts, tables — so
// they share one renderer rather than drifting into two different typographies.

export type Variant = 'webd' | 'daml' | 'ml' | 'go' | 'reactnative' | 'dsa';

// `accentLift` is the same hue raised to stay legible on the dark stage — the
// base accent is tuned for white and turns muddy on #0F0F0D. Which one wins is
// decided in globals.css (`--deck-accent`), never inline: an inline custom
// property outranks every selector and would kill the dark override.
export const VARIANT_THEME: Record<Variant, { accent: string; accentLift: string; accentSoft: string; accentDeep: string; ring: string }> = {
  webd: {
    accent: '#3E5C77',
    accentLift: '#8FB3D0',
    accentSoft: '#F6F9FB',
    accentDeep: '#23384A',
    ring: 'rgba(62,92,119,0.35)',
  },
  daml: {
    accent: '#9A6452',
    accentLift: '#D4A090',
    accentSoft: '#F7F0ED',
    accentDeep: '#5E382C',
    ring: 'rgba(154,100,82,0.35)',
  },
  ml: {
    accent: '#3C664F',
    accentLift: '#8FC3A6',
    accentSoft: '#EEF5F1',
    accentDeep: '#1E3A2A',
    ring: 'rgba(60,102,79,0.35)',
  },
  go: {
    accent: '#00ADD8',
    accentLift: '#5FD3F0',
    accentSoft: '#EFFBFE',
    accentDeep: '#075A72',
    ring: 'rgba(0,173,216,0.35)',
  },
  reactnative: {
    accent: '#61DAFB',
    accentLift: '#7FE0FF',
    accentSoft: '#F1FBFE',
    accentDeep: '#146078',
    ring: 'rgba(97,218,251,0.35)',
  },
  dsa: {
    accent: '#6366F1',
    accentLift: '#A5A7FA',
    accentSoft: '#F1F1FE',
    accentDeep: '#312E81',
    ring: 'rgba(99,102,241,0.35)',
  },
};

export function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children);
  return '';
}

export function CodeBlock({ codeText, children }: { codeText: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="group/code relative my-4">
      <pre className="overflow-hidden rounded-xl bg-[#F8F7F5] dark:bg-[#141413] border border-[#E5E4DF] dark:border-[#2C2B28] [&>code]:block [&>code]:px-5 [&>code]:py-4 [&>code]:overflow-x-auto">
        {children}
      </pre>
      {codeText && (
        <button
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-[#F2F1EE] dark:bg-[#232321] border border-[#E5E4DF] dark:border-[#2C2B28] text-[#8A8A86] dark:text-[#686664] hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors opacity-0 focus-visible:opacity-100 group-hover/code:opacity-100"
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#5D8E72]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
}

export function DeckMarkdown({ source, variant }: { source: string; variant: Variant }) {
  const accent = VARIANT_THEME[variant];
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] dark:text-[#F5F4F1] mb-6 mt-2 first:mt-0 leading-tight tracking-tight">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] dark:text-[#F5F4F1] mb-4 mt-10 first:mt-0 leading-tight tracking-tight">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold text-[#1A1A1A] dark:text-[#F5F4F1] mb-3 mt-8">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-semibold text-[#3A3A38] dark:text-[#C4C2BE] mb-2 mt-6 uppercase tracking-wide">{children}</h4>,
        p: ({ children }) => <p className="text-[16px] md:text-[17px] text-[#3A3A38] dark:text-[#C4C2BE] leading-[1.75] mb-5">{children}</p>,
        code: ({ className, children }) => {
          const isBlock = className?.includes('hljs') || className?.includes('language-');
          return isBlock ? (
            <code className={`${className || ''} text-[13.5px] leading-relaxed`}>{children}</code>
          ) : (
            <code className="px-1.5 py-0.5 rounded-md text-[14px] font-mono bg-[#F2F1EE] dark:bg-[#232321] text-[#1A1A1A] dark:text-[#E8E7E4] border border-[#E5E4DF] dark:border-[#2C2B28]">
              {children}
            </code>
          );
        },
        pre: ({ children }) => {
          const childArray = Children.toArray(children);
          const firstChild = childArray.find(c => isValidElement(c));
          const childProps = isValidElement(firstChild) ? (firstChild.props as { children?: ReactNode }) : undefined;
          const codeText = childProps ? extractText(childProps.children).trim() : '';
          return <CodeBlock codeText={codeText}>{children}</CodeBlock>;
        },
        ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-5 text-[16px] md:text-[17px] text-[#3A3A38] dark:text-[#C4C2BE]">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-5 text-[16px] md:text-[17px] text-[#3A3A38] dark:text-[#C4C2BE]">{children}</ol>,
        li: ({ children }) => <li className="leading-[1.7] pl-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote
            className="pl-5 pr-4 py-3 my-6 rounded-r-lg border-l-4 bg-[#F8F7F5] dark:bg-[#181816]"
            style={{ borderColor: accent.accent }}
          >
            <div className="text-[15.5px] leading-relaxed text-[#3A3A38] dark:text-[#D4D2CE]">{children}</div>
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-6 rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28]">
            <table className="w-full border-collapse text-[14.5px]">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-[#F2F1EE] dark:bg-[#232321] px-4 py-3 text-left font-semibold text-[#1A1A1A] dark:text-[#F5F4F1] border-b border-[#E5E4DF] dark:border-[#2C2B28]">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-[#3A3A38] dark:text-[#C4C2BE] border-b border-[#F2F1EE] dark:border-[#2C2B28] align-top">
            {children}
          </td>
        ),
        hr: () => <hr className="my-8 border-t border-[#E5E4DF] dark:border-[#2C2B28]" />,
        a: ({ href, children }) => {
          if (href?.includes('/notes/preview/')) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="not-prose inline-flex items-center gap-2.5 px-6 py-3 my-2 rounded-full text-[15px] font-semibold no-underline transition-all hover:brightness-110 hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(to right, ${accent.accent}, ${accent.accentDeep})`,
                  color: '#fff',
                  boxShadow: `0 4px 14px ${accent.ring}`,
                }}
              >
                {children} <ExternalLink className="w-4 h-4" />
              </a>
            );
          }
          return (
            <a
              href={href}
              className="underline transition-colors"
              style={{ color: accent.accent }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        kbd: ({ children }) => (
          <kbd className="px-1.5 py-0.5 rounded border border-[#E5E4DF] dark:border-[#2C2B28] bg-[#F8F7F5] dark:bg-[#141413] text-[11px] font-mono">
            {children}
          </kbd>
        ),
      }}
    >
      {source}
    </ReactMarkdown>
  );
}
