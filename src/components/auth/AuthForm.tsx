'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';

import { SessionUser, updateSession } from '@/lib/useSession';

interface AuthFormProps {
  /** Where to land after success. Supplied by the ?next= query param. */
  next?: string;
}

/**
 * One form for both signing in and signing up.
 *
 * Submitting always tries to sign in first. If no account has that username,
 * the server says so and the form switches to a short confirmation step rather
 * than creating the account behind the learner's back — a typo would otherwise
 * hand them an empty account and look exactly like lost progress.
 */
export function AuthForm({ next }: AuthFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Set once the server confirms this username is free; holds the exact
  // normalised name the account will be created under.
  const [confirmSignup, setConfirmSignup] = useState<string | null>(null);

  function goToDestination(user: SessionUser) {
    updateSession(user);
    router.replace(next && next.startsWith('/') ? next : '/');
    router.refresh();
  }

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        goToDestination(data.user);
        return;
      }

      if (data.needsSignup) {
        setConfirmSignup(data.username);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount() {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        goToDestination(data.user);
        return;
      }

      setError(data.error || 'Could not create the account.');
      // A rejected password has to be fixed on the main form, so go back to it.
      setConfirmSignup(null);
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-3 text-sm ' +
    'text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-colors ' +
    'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]';

  // ── Step 2: confirm creating a new account ────────────────────────────────
  if (confirmSignup) {
    return (
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--bg-tertiary)]">
              <UserPlus className="h-5 w-5 text-[var(--text-secondary)]" />
            </span>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Create this account?</h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-tertiary)]">
              There&rsquo;s no account called{' '}
              <span className="font-mono font-medium text-[var(--text-primary)]">{confirmSignup}</span> yet.
              We&rsquo;ll make one with the password you just entered.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-[var(--accent-rose-soft)] px-3 py-2 text-sm text-[var(--accent-rose-text)]"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleCreateAccount}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] py-3 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Creating…' : `Create ${confirmSignup}`}
          </button>

          <button
            type="button"
            onClick={() => {
              setConfirmSignup(null);
              setError('');
            }}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Use a different username
          </button>
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-[var(--text-muted)]">
          Meant to sign in to an existing account? Go back and check the spelling — usernames are
          case-insensitive but otherwise exact.
        </p>
      </div>
    );
  }

  // ── Step 1: username + password ───────────────────────────────────────────
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-semibold leading-tight text-[var(--text-primary)]">Sign in</h1>
          <p className="mt-2 text-sm text-[var(--text-tertiary)]">
            New here? Pick a username and we&rsquo;ll create your account.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={event => setUsername(event.target.value)}
              placeholder="yourname"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
              required
              className={inputClass}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="password" className="block text-xs font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(value => !value)}
                className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-[var(--accent-rose-soft)] px-3 py-2 text-sm text-[var(--accent-rose-text)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] py-3 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Checking…' : 'Continue'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-[var(--text-muted)]">
        No email, no verification codes. New accounts need 8+ characters mixing two of:
        lowercase, uppercase, numbers, symbols.
      </p>
    </div>
  );
}
