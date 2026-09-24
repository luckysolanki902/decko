'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ kind: 'error' | 'success'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ kind: 'error', message: 'The two new passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();

      if (data.success) {
        setStatus({ kind: 'success', message: 'Password updated.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatus({ kind: 'error', message: data.error || 'Could not update the password.' });
      }
    } catch {
      setStatus({ kind: 'error', message: 'Could not reach the server.' });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-2.5 text-sm ' +
    'text-[var(--text-primary)] transition-colors focus:border-transparent focus:outline-none ' +
    'focus:ring-2 focus:ring-[var(--accent-blue)]';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
          Current password
        </label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={event => setCurrentPassword(event.target.value)}
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
          New password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={event => setNewPassword(event.target.value)}
          autoComplete="new-password"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={event => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          required
          className={inputClass}
        />
      </div>

      {status && (
        <p
          role="alert"
          className={`rounded-lg px-3 py-2 text-sm ${
            status.kind === 'error'
              ? 'bg-[var(--accent-rose-soft)] text-[var(--accent-rose-text)]'
              : 'bg-[var(--success-soft)] text-[var(--success)]'
          }`}
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 py-2.5 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
