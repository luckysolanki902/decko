/**
 * Canonical site identity. Everything that needs the name, URL or repo link
 * reads it from here, so a fork only has to change this file (or set
 * NEXT_PUBLIC_SITE_URL) rather than hunting through metadata and components.
 */

export const SITE_NAME = 'decko';

export const SITE_TAGLINE = 'Your course, in decks.';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://decko.vercel.app';

export const GITHUB_REPO_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/luckysolanki902/decko';
