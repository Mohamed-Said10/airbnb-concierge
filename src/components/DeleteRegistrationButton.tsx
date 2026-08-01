'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!confirmationOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cancelButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !deleting) setConfirmationOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [confirmationOpen, deleting]);

  const remove = async () => {
    setDeleting(true);
    setError('');
    try {
      const response = await fetch(endpoint, { method: 'DELETE', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Delete failed');
      window.location.replace(redirectTo);
    } catch {
      setError('Unable to delete this registration. Please try again.');
      setDeleting(false);
      setConfirmationOpen(false);
    }
  };

  return (
    <div className="print-hidden">
      <button
        type="button"
        onClick={() => setConfirmationOpen(true)}
        disabled={deleting}
        className="rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
      >
        {deleting ? 'Deleting…' : label}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {confirmationOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) setConfirmationOpen(false);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-registration-title"
            aria-describedby="delete-registration-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="p-6 sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.3 3.7 2.4 17.4A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.6L13.7 3.7a2 2 0 0 0-3.4 0Z" />
                </svg>
              </div>
              <h2 id="delete-registration-title" className="text-xl font-bold text-gray-900">
                Remove registration?
              </h2>
              <p id="delete-registration-description" className="mt-2 text-sm leading-6 text-gray-600">
                {confirmation}
              </p>
              <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                This action cannot be undone.
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => setConfirmationOpen(false)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
              >
                {deleting && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z" />
                  </svg>
                )}
                {deleting ? 'Removing…' : 'Remove permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
