import { NextRequest, NextResponse } from 'next/server';

import { ProjectStatus, ProjectStatusRecord, getCollection } from '@/lib/mongodb';
import { getSession, requireSession } from '@/lib/auth';
import { ROADMAP_SECTIONS, RoadmapSection } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATUSES: ProjectStatus[] = ['active', 'completed', 'ignored'];

function parseSection(value: string | null): RoadmapSection | null {
  return value && ROADMAP_SECTIONS.includes(value as never) ? (value as RoadmapSection) : null;
}

// GET — project statuses for the signed-in learner, optionally one section.
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: true, statuses: [] });
    }

    const section = parseSection(new URL(request.url).searchParams.get('section'));
    const collection = await getCollection<ProjectStatusRecord>('project_status');

    const rows = await collection
      .find(section ? { userId: session.userId, section } : { userId: session.userId })
      .toArray();

    return NextResponse.json({
      success: true,
      statuses: rows.map(row => ({
        projectId: row.projectId,
        section: row.section,
        status: row.status,
        completedAt: row.completedAt,
        ignoredAt: row.ignoredAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching project statuses:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch project statuses' }, { status: 500 });
  }
}

// POST — set one project's status for the signed-in learner.
export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (!auth.session) {
    return auth.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const projectId = typeof body.projectId === 'string' ? body.projectId : '';
    const section = parseSection(typeof body.section === 'string' ? body.section : null);
    const status = body.status as ProjectStatus;

    if (!projectId || !section) {
      return NextResponse.json({ success: false, error: 'Missing projectId or section' }, { status: 400 });
    }
    if (!STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be active, completed or ignored' },
        { status: 400 }
      );
    }

    const collection = await getCollection<ProjectStatusRecord>('project_status');
    const now = new Date();

    await collection.updateOne(
      { userId: auth.session.userId, projectId, section },
      {
        $set: {
          status,
          completedAt: status === 'completed' ? now : null,
          ignoredAt: status === 'ignored' ? now : null,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, projectId, section, status });
  } catch (error) {
    console.error('Error updating project status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project status' }, { status: 500 });
  }
}
