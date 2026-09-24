/**
 * MCP (Model Context Protocol) endpoint — Streamable HTTP, stateless, read-only.
 *
 * Authentication: Bearer token via Authorization header.
 * Set MCP_API_SECRET env var.  Default (dev-only): "decko-mcp-dev-secret"
 *
 * Endpoint:  POST /api/mcp
 * Tools: list_courses, list_phases, get_phase_details, list_lectures,
 *        get_lecture, list_syllabus_files, get_syllabus_file, search_topics
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod/v4';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';

import { damlRoadmap } from '@/data/daml';
import { webdRoadmap } from '@/data/webd';
import { mlRoadmap } from '@/data/ml';
import { dsaRoadmap } from '@/data/dsa';
import { goRoadmap } from '@/data/go';
import { reactNativeRoadmap } from '@/data/reactnative';

// ─── Config ───────────────────────────────────────────────────────────────────

const MCP_SECRET =
  process.env.MCP_API_SECRET ?? 'decko-mcp-dev-secret';

const ROADMAPS = {
  daml: damlRoadmap,
  webd: webdRoadmap,
  ml: mlRoadmap,
  dsa: dsaRoadmap,
  go: goRoadmap,
  reactnative: reactNativeRoadmap,
} as const;

type CourseId = keyof typeof ROADMAPS;

const LECTURES_BASE = path.join(process.cwd(), 'public', 'data', 'lectures');
const SYLLABUS_BASE = path.join(process.cwd(), 'src', 'data', 'syllabus');
const SYLLABUS_DIRS: Record<string, string> = {
  daml: 'pydamlroadmap',
  webd: 'webdroadmap',
  ml: 'mlroadmap',
  dsa: 'dsaroadmap',
  go: 'goroadmap',
  reactnative: 'reactnativeroadmap',
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${MCP_SECRET}`;
}

// ─── Security helpers ─────────────────────────────────────────────────────────

/** Prevent path traversal. Returns safe resolved path or throws. */
function safePath(base: string, ...parts: string[]): string {
  const joined = path.join(base, ...parts);
  const resolved = path.resolve(joined);
  const resolvedBase = path.resolve(base);
  if (!resolved.startsWith(resolvedBase + path.sep) && resolved !== resolvedBase) {
    throw new Error('Invalid path');
  }
  return resolved;
}

function safeFilename(name: string): void {
  if (!name || /[/\\<>:"|?*\x00]/.test(name) || name.includes('..')) {
    throw new Error('Invalid filename');
  }
}

// ─── Tool logic ───────────────────────────────────────────────────────────────

function listCourses() {
  return Object.values(ROADMAPS).map((rm) => ({
    id: rm.id,
    title: rm.title,
    subtitle: rm.subtitle,
    description: rm.description,
    total_days: rm.totalDays,
    total_hours: rm.totalHours,
    phases_count: rm.phases.length,
  }));
}

function listPhases(courseId: string) {
  const rm = ROADMAPS[courseId as CourseId];
  if (!rm) throw new Error(`Unknown course: "${courseId}". Valid: daml, webd, ml, dsa, go, reactnative`);
  return rm.phases.map((p) => ({
    id: p.id ?? `phase${p.number}`,
    number: p.number,
    title: p.title,
    subtitle: p.subtitle,
    duration: p.duration,
    days: p.days,
    goal: p.goal,
    sections_count: p.sections.length,
  }));
}

function getPhaseDetails(courseId: string, phaseId: string) {
  const rm = ROADMAPS[courseId as CourseId];
  if (!rm) throw new Error(`Unknown course: "${courseId}"`);
  const phase = rm.phases.find(
    (p) => p.id === phaseId || `phase${p.number}` === phaseId
  );
  if (!phase) throw new Error(`Phase "${phaseId}" not found in course "${courseId}"`);
  // Return just what's needed — topics can be large so return full Phase object
  return phase;
}

async function listLectures(courseId: string, phaseId: string) {
  const dirPath = safePath(LECTURES_BASE, courseId, phaseId);
  try {
    const files = await fs.readdir(dirPath);
    return files
      .filter((f) => f.endsWith('.md') || f.endsWith('.html'))
      .sort()
      .map((filename) => ({
        filename,
        format: filename.endsWith('.html') ? 'html' : 'md',
        path: `${courseId}/${phaseId}/${filename}`,
      }));
  } catch {
    return [];
  }
}

async function getLecture(courseId: string, phaseId: string, filename: string) {
  safeFilename(filename);
  if (!filename.endsWith('.md') && !filename.endsWith('.html')) {
    throw new Error('Only .md and .html files are supported');
  }
  const filePath = safePath(LECTURES_BASE, courseId, phaseId, filename);
  const content = await fs.readFile(filePath, 'utf-8');
  return {
    filename,
    format: filename.endsWith('.html') ? 'html' : 'md',
    course_id: courseId,
    phase_id: phaseId,
    content,
  };
}

async function listSyllabusFiles(courseId: string) {
  const dirName = SYLLABUS_DIRS[courseId];
  if (!dirName) throw new Error(`Unknown course: "${courseId}". Valid: daml, webd, ml, dsa, go, reactnative`);
  const dirPath = safePath(SYLLABUS_BASE, dirName);
  try {
    const files = await fs.readdir(dirPath);
    return files.filter((f) => f.endsWith('.md')).sort().map((f) => ({ filename: f }));
  } catch {
    return [];
  }
}

async function getSyllabusFile(courseId: string, filename: string) {
  safeFilename(filename);
  if (!filename.endsWith('.md')) throw new Error('Only .md files are supported');
  const dirName = SYLLABUS_DIRS[courseId];
  if (!dirName) throw new Error(`Unknown course: "${courseId}"`);
  const filePath = safePath(SYLLABUS_BASE, dirName, filename);
  return await fs.readFile(filePath, 'utf-8');
}

function searchTopics(query: string, courseId?: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  type Hit = {
    course_id: string;
    phase_id: string;
    phase_title: string;
    section_title: string;
    topic_title: string;
    matched_items: string[];
  };

  const results: Hit[] = [];
  const roadmapsToSearch = courseId
    ? [ROADMAPS[courseId as CourseId]].filter(Boolean)
    : Object.values(ROADMAPS);

  for (const rm of roadmapsToSearch) {
    if (!rm) continue;
    for (const phase of rm.phases) {
      const pid = phase.id ?? `phase${phase.number}`;
      for (const section of phase.sections) {
        const topics =
          'topics' in section && section.topics
            ? section.topics
            : 'content' in section && section.content?.topics
              ? section.content.topics
              : [];
        for (const topic of topics) {
          const titleHit = topic.title.toLowerCase().includes(q);
          const itemHits = topic.items.filter((item: string) =>
            item.toLowerCase().includes(q)
          );
          if (titleHit || itemHits.length > 0) {
            results.push({
              course_id: rm.id,
              phase_id: pid,
              phase_title: phase.title,
              section_title: section.title,
              topic_title: topic.title,
              matched_items: titleHit ? topic.items : itemHits,
            });
            if (results.length >= 50) return results; // cap
          }
        }
      }
    }
  }
  return results;
}

// ─── MCP Server factory ───────────────────────────────────────────────────────

function createMcpServer() {
  const server = new McpServer({
    name: 'decko',
    version: '1.0.0',
  });

  server.registerTool(
    'list_courses',
    {
      title: 'List Courses',
      description:
        'List all available learning courses/roadmaps with metadata (id, title, description, total days/hours, phases count).',
      inputSchema: {},
    },
    async () => ({
      content: [{ type: 'text', text: JSON.stringify(listCourses(), null, 2) }],
    })
  );

  server.registerTool(
    'list_phases',
    {
      title: 'List Phases',
      description: 'List all phases for a course with overview info (id, title, goal, duration, sections count).',
      inputSchema: {
        course_id: z
          .string()
          .describe('Course identifier — one of: daml, webd, ml, dsa, go, reactnative'),
      },
    },
    async ({ course_id }) => ({
      content: [{ type: 'text', text: JSON.stringify(listPhases(course_id), null, 2) }],
    })
  );

  server.registerTool(
    'get_phase_details',
    {
      title: 'Get Phase Details',
      description:
        'Get the full content of a phase: all sections (days), topics, and subtopic bullet points.',
      inputSchema: {
        course_id: z
          .string()
          .describe('Course identifier — one of: daml, webd, ml, dsa, go, reactnative'),
        phase_id: z
          .string()
          .describe('Phase ID such as "phase0", "phase1", "phase2", etc.'),
      },
    },
    async ({ course_id, phase_id }) => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(getPhaseDetails(course_id, phase_id), null, 2),
        },
      ],
    })
  );

  server.registerTool(
    'list_lectures',
    {
      title: 'List Lectures',
      description:
        'List available lecture files (markdown or HTML) for a specific course + phase.',
      inputSchema: {
        course_id: z
          .string()
          .describe('Course identifier — daml, webd, ml, dsa, go, or reactnative; lectures may be generated on demand'),
        phase_id: z
          .string()
          .describe('Phase folder name, e.g. "phase0", "phase1"'),
      },
    },
    async ({ course_id, phase_id }) => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(await listLectures(course_id, phase_id), null, 2),
        },
      ],
    })
  );

  server.registerTool(
    'get_lecture',
    {
      title: 'Get Lecture',
      description:
        'Return the full content of a lecture file (markdown or HTML). Use list_lectures first to discover filenames.',
      inputSchema: {
        course_id: z.string().describe('Course identifier — daml, webd, ml, dsa, go, or reactnative'),
        phase_id: z.string().describe('Phase folder name, e.g. "phase1"'),
        filename: z
          .string()
          .describe('Lecture filename, e.g. "day01-setup-hello-world.md" or "day01-the-web-in-2-hours.html"'),
      },
    },
    async ({ course_id, phase_id, filename }) => {
      const result = await getLecture(course_id, phase_id, filename);
      return {
        content: [{ type: 'text', text: result.content }],
      };
    }
  );

  server.registerTool(
    'list_syllabus_files',
    {
      title: 'List Syllabus Files',
      description: 'List all syllabus markdown files available for a course.',
      inputSchema: {
        course_id: z.string().describe('Course identifier — one of: daml, webd, ml, dsa, go, reactnative'),
      },
    },
    async ({ course_id }) => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(await listSyllabusFiles(course_id), null, 2),
        },
      ],
    })
  );

  server.registerTool(
    'get_syllabus_file',
    {
      title: 'Get Syllabus File',
      description:
        'Return the full content of a syllabus markdown file. Use list_syllabus_files first to discover filenames.',
      inputSchema: {
        course_id: z.string().describe('Course identifier — one of: daml, webd, ml, dsa, go, reactnative'),
        filename: z
          .string()
          .describe('Syllabus filename, e.g. "01-phase0-git-markdown.md" or "00-Overview.md"'),
      },
    },
    async ({ course_id, filename }) => ({
      content: [{ type: 'text', text: await getSyllabusFile(course_id, filename) }],
    })
  );

  server.registerTool(
    'search_topics',
    {
      title: 'Search Topics',
      description:
        'Search for topics and subtopic bullet points across all courses (or a specific course) by keyword. Returns up to 50 matches.',
      inputSchema: {
        query: z.string().describe('Keyword or phrase to search for in topic titles and bullet items'),
        course_id: z
          .string()
          .optional()
          .describe('Optional: restrict search to a specific course (daml, webd, ml, dsa, go, or reactnative)'),
      },
    },
    async ({ query, course_id }) => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(searchTopics(query, course_id), null, 2),
        },
      ],
    })
  );

  return server;
}

// ─── CORS headers ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, MCP-Protocol-Version',
};

function withCors(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS_HEADERS)) {
    headers.set(k, v);
  }
  return new Response(res.body, { status: res.status, headers });
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse('Unauthorized', { status: 401, headers: CORS_HEADERS });
  }
  // Streamable HTTP GET is used for standalone SSE streams.
  // We support it so clients can open a listening stream.
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
    enableJsonResponse: true,
  });
  const server = createMcpServer();
  try {
    await server.connect(transport);
    const res = await transport.handleRequest(req);
    return withCors(res);
  } finally {
    await server.close().catch(() => null);
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse('Unauthorized', { status: 401, headers: CORS_HEADERS });
  }
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32000, message: 'Unauthorized' } },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — no session tracking
    enableJsonResponse: true,      // return application/json, not SSE
  });
  const server = createMcpServer();

  try {
    await server.connect(transport);
    const res = await transport.handleRequest(req);
    return withCors(res);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32603, message } },
      { status: 500, headers: CORS_HEADERS }
    );
  } finally {
    await server.close().catch(() => null);
  }
}
