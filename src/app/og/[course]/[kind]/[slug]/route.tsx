import { ImageResponse } from 'next/og';

import { getCourseSeo, getLecture, getPhase, type CourseId } from '@/lib/seo';

export const runtime = 'nodejs';

const size = { width: 1200, height: 630 };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ course: string; kind: string; slug: string }> },
) {
  const { course, kind, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const courseValue = course === 'site' ? null : getCourseSeo(course);

  if (course !== 'site' && !courseValue) return new Response('Not found', { status: 404 });

  let eyebrow = 'Free, in-depth engineering courses';
  let title = 'Courses you actually remember';
  let description = 'Six learning paths. No skipped steps. Revision built around retrieval practice.';
  let accent = '#8AAAC4';

  if (courseValue) {
    eyebrow = courseValue.shortTitle;
    title = courseValue.title;
    description = courseValue.description;
    accent = courseValue.accent;

    if (kind === 'phase') {
      const phase = getPhase(course as CourseId, decodedSlug);
      if (!phase) return new Response('Not found', { status: 404 });
      eyebrow = `${courseValue.shortTitle} · Phase ${phase.number}`;
      title = phase.title;
      description = phase.subtitle;
    }

    if (kind === 'lecture') {
      const lecture = getLecture(course as CourseId, decodedSlug);
      if (!lecture) return new Response('Not found', { status: 404 });
      eyebrow = `${courseValue.shortTitle} · ${lecture.phase} · ${lecture.day}`;
      title = lecture.title;
      description = `A free ${lecture.duration.toLowerCase()} lesson with worked examples, practice, and recall checks.`;
    }
  }

  return new ImageResponse(
    <div
      style={{
        background: '#F7F6F2',
        color: '#1A1A19',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '68px 76px',
        position: 'relative',
        width: '100%',
      }}
    >
      <div style={{ background: accent, height: 12, left: 0, position: 'absolute', top: 0, width: '100%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1010 }}>
        <div style={{ color: accent, display: 'flex', fontSize: 25, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {eyebrow}
        </div>
        <div style={{ display: 'flex', fontSize: title.length > 52 ? 58 : 68, fontWeight: 750, letterSpacing: -2.5, lineHeight: 1.04 }}>
          {title}
        </div>
        <div style={{ color: '#5B5B57', display: 'flex', fontSize: 27, lineHeight: 1.45, maxWidth: 980 }}>
          {description}
        </div>
      </div>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: 18 }}>
          {/* Satori requires an explicit display on any element with more than
              one child, so this wrapper declares flex even though its children
              are absolutely positioned. */}
          <div style={{ background: '#1A1A19', borderRadius: 10, display: 'flex', height: 48, position: 'relative', width: 48 }}>
            <div style={{ background: accent, borderRadius: 3, height: 20, left: 8, position: 'absolute', top: 13, transform: 'rotate(-8deg)', width: 29 }} />
            <div style={{ background: '#F7F6F2', borderRadius: 3, height: 20, left: 11, position: 'absolute', top: 14, transform: 'rotate(4deg)', width: 29 }} />
          </div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>decko</div>
        </div>
        <div style={{ color: '#777771', display: 'flex', fontSize: 22 }}>Learn deeply. Remember longer.</div>
      </div>
    </div>,
    size,
  );
}
