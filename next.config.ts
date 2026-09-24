import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Ensure MCP route can access syllabus .md files and lecture files at runtime
  outputFileTracingIncludes: {
    '/api/mcp': [
      './src/data/syllabus/**/*.md',
      './public/data/lectures/**',
    ],
    // Revision generation condenses the real lecture markdown, so the files must
    // be traced into that function's bundle too.
    '/api/revision/generate': ['./public/data/lectures/**'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
        ],
      },
    ];
  },
};

export default nextConfig;
