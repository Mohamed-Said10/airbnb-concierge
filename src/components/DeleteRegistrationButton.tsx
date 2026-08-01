'use client';

import { useState } from 'react';

interface Props {
  endpoint: string;
  redirectTo: string;
  label?: string;
  confirmation?: string;
}

export default function DeleteRegistrationButton({
  endpoint,
  redirectTo,
  label = 'Delete registration',
  confirmation = 'Permanently delete this registration and its documents?',
}: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const remove = async () => {
    if (!window.confirm(confirmation)) return;
    setDeleting(true);
    setError('');
    try {
      const response = await fetch(endpoint, { method: 'DELETE', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Delete failed');
      window.location.replace(redirectTo);
    } catch {
      setError('Unable to delete this registration. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="print-hidden">
      <button
        type="button"
        onClick={remove}
        disabled={deleting}
        className="rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
      >
        {deleting ? 'Deleting…' : label}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
