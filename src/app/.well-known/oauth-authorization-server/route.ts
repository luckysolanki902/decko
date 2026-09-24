/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414)
 * Required so ChatGPT can discover the token endpoint.
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const issuer =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'https://decko.vercel.app';

  return NextResponse.json({
    issuer,
    token_endpoint: `${issuer}/api/mcp/oauth/token`,
    token_endpoint_auth_methods_supported: [
      'client_secret_post',
      'client_secret_basic',
    ],
    grant_types_supported: ['client_credentials'],
    scopes_supported: ['mcp'],
    response_types_supported: ['token'],
  });
}
