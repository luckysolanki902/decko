/**
 * OAuth 2.0 Token Endpoint — client_credentials grant only.
 *
 * Static credentials (no user login):
 *   client_id     = MCP_OAUTH_CLIENT_ID   (default: "chatgpt")
 *   client_secret = MCP_API_SECRET
 *
 * On success returns MCP_API_SECRET as the Bearer access_token.
 * ChatGPT will then use this token on every MCP tool call.
 */
import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID =
  process.env.MCP_OAUTH_CLIENT_ID ?? 'chatgpt';
const CLIENT_SECRET =
  process.env.MCP_API_SECRET ?? 'decko-mcp-dev-secret';

function unauthorized(description: string) {
  return NextResponse.json(
    { error: 'invalid_client', error_description: description },
    { status: 401 }
  );
}

export async function POST(req: NextRequest) {
  // Accept both application/json and application/x-www-form-urlencoded
  let grant_type: string | null = null;
  let client_id: string | null = null;
  let client_secret: string | null = null;

  const ct = req.headers.get('content-type') ?? '';

  if (ct.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    grant_type = params.get('grant_type');
    client_id = params.get('client_id');
    client_secret = params.get('client_secret');
  } else {
    try {
      const body = await req.json();
      grant_type = body.grant_type ?? null;
      client_id = body.client_id ?? null;
      client_secret = body.client_secret ?? null;
    } catch {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Invalid JSON body' },
        { status: 400 }
      );
    }
  }

  // Also support HTTP Basic auth (client_secret_basic)
  const authHeader = req.headers.get('authorization') ?? '';
  if (authHeader.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(authHeader.slice(6), 'base64').toString();
      const colon = decoded.indexOf(':');
      if (colon !== -1) {
        client_id = decoded.slice(0, colon);
        client_secret = decoded.slice(colon + 1);
      }
    } catch { /* ignore */ }
  }

  if (grant_type !== 'client_credentials') {
    return NextResponse.json(
      { error: 'unsupported_grant_type', error_description: 'Only client_credentials is supported' },
      { status: 400 }
    );
  }

  if (client_id !== CLIENT_ID) {
    return unauthorized('Unknown client_id');
  }
  if (client_secret !== CLIENT_SECRET) {
    return unauthorized('Invalid client_secret');
  }

  return NextResponse.json({
    access_token: CLIENT_SECRET,
    token_type: 'Bearer',
    expires_in: 86400,
    scope: 'mcp',
  });
}
