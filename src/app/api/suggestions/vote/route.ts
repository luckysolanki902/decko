import { NextRequest, NextResponse } from 'next/server';

import { requireSession } from '@/lib/auth';
import { clientKey, rateLimit } from '@/lib/rateLimit';
import { SUGGESTION_KINDS, findOrCreateByReference, toggleVote } from '@/lib/suggestions';
import { SuggestionKind } from '@/lib/mongodb';
import { ROADMAP_SECTIONS } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * Toggles a vote.
 *
 * Two shapes are accepted:
 *   { suggestionId }                       — vote on an existing request
 *   { kind, reference, title, roadmapId }  — vote on a thing that may not have
 *                                            a request yet; it is created on
 *                                            the first vote, so inline "vote for
 *                                            this lecture" buttons just work.
 */
export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  const limit = rateLimit(`vote:${clientKey(request)}`, 120, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many votes at once. Try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    let suggestionId = typeof body.suggestionId === 'string' ? body.suggestionId : '';

    if (!suggestionId) {
      const kind = typeof body.kind === 'string' ? body.kind : '';
      const reference = typeof body.reference === 'string' ? body.reference : '';
      const title = typeof body.title === 'string' ? body.title : '';

      if (!SUGGESTION_KINDS.includes(kind as SuggestionKind) || !reference || !title) {
        return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
      }

      const roadmapId = typeof body.roadmapId === 'string' ? body.roadmapId : null;
      const created = await findOrCreateByReference({
        userId: auth.session.userId,
        displayName: auth.session.displayName,
        kind: kind as SuggestionKind,
        title,
        body: typeof body.body === 'string' ? body.body : '',
        roadmapId: roadmapId && ROADMAP_SECTIONS.includes(roadmapId as never) ? roadmapId : null,
        reference,
      });

      // A brand-new request already counts its author's vote, so returning here
      // avoids immediately toggling that vote back off.
      if (created.hasVoted && created.voteCount === 1) {
        return NextResponse.json({
          success: true,
          suggestionId: created.id,
          voteCount: created.voteCount,
          hasVoted: true,
        });
      }
      suggestionId = created.id;
    }

    const result = await toggleVote(auth.session.userId, suggestionId);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error toggling vote:', error);
    return NextResponse.json({ success: false, error: 'Failed to record the vote' }, { status: 500 });
  }
}
