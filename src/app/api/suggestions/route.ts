import { NextRequest, NextResponse } from 'next/server';

import { getSession, requireSession } from '@/lib/auth';
import { clientKey, rateLimit } from '@/lib/rateLimit';
import {
  SUGGESTION_KINDS,
  SUGGESTION_STATUSES,
  createSuggestion,
  listSuggestions,
} from '@/lib/suggestions';
import { SuggestionKind, SuggestionStatus } from '@/lib/mongodb';
import { ROADMAP_SECTIONS } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function parseKind(value: string | null): SuggestionKind | null {
  return value && SUGGESTION_KINDS.includes(value as SuggestionKind) ? (value as SuggestionKind) : null;
}

function parseStatus(value: string | null): SuggestionStatus | null {
  return value && SUGGESTION_STATUSES.includes(value as SuggestionStatus)
    ? (value as SuggestionStatus)
    : null;
}

function parseRoadmap(value: string | null): string | null {
  return value && ROADMAP_SECTIONS.includes(value as never) ? value : null;
}

// GET — the ranked backlog. Public: anyone can see what learners want next.
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = request.nextUrl;

    const suggestions = await listSuggestions({
      userId: session?.userId ?? null,
      roadmapId: parseRoadmap(searchParams.get('roadmapId')),
      kind: parseKind(searchParams.get('kind')),
      status: parseStatus(searchParams.get('status')),
      limit: Number(searchParams.get('limit')) || undefined,
    });

    return NextResponse.json({ success: true, suggestions, isSignedIn: Boolean(session) });
  } catch (error) {
    console.error('Error listing suggestions:', error);
    return NextResponse.json({ success: false, error: 'Failed to load requests' }, { status: 500 });
  }
}

// POST — file a new request or note. Requires an account so votes mean something.
export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  const limit = rateLimit(`suggest:${clientKey(request)}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'That is a lot of requests at once. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const kind = parseKind(typeof body.kind === 'string' ? body.kind : null);

    if (!kind) {
      return NextResponse.json(
        { success: false, error: 'Pick what this is about: a lecture, section, course or correction.' },
        { status: 400 }
      );
    }

    const result = await createSuggestion({
      userId: auth.session.userId,
      displayName: auth.session.displayName,
      kind,
      title: typeof body.title === 'string' ? body.title : '',
      body: typeof body.body === 'string' ? body.body : '',
      roadmapId: parseRoadmap(typeof body.roadmapId === 'string' ? body.roadmapId : null),
      reference: typeof body.reference === 'string' && body.reference ? body.reference : null,
    });

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, suggestion: result.suggestion });
  } catch (error) {
    console.error('Error creating suggestion:', error);
    return NextResponse.json({ success: false, error: 'Failed to save the request' }, { status: 500 });
  }
}
