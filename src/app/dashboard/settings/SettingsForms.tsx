'use client';

import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';

export function UpdateNameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (error) {
      setMessage(error.message);
    } else {
      await supabase.from('profiles').update({ full_name: name }).eq('id', (await supabase.auth.getUser()).data.user!.id);
      setMessage('Name updated.');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full name</label>
        <input
          id="fullName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      {message && (
        <p className={`text-sm ${message === 'Name updated.' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors"
      >
        {saving ? 'Saving...' : 'Save name'}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      setMessage('New passwords do not match.');
      return;
    }
    setSaving(true);
    setMessage('');
    const supabase = createBrowserSupabase();

    // Re-authenticate with current password first
    const { data: { user } } = await supabase.auth.getUser();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: current,
    });
    if (signInError) {
      setMessage('Current password is incorrect.');
      setSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated.');
      setCurrent(''); setNext(''); setConfirm('');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="current" className="block text-sm font-medium text-gray-700">Current password</label>
        <input
          id="current"
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      <div>
        <label htmlFor="newPass" className="block text-sm font-medium text-gray-700">New password</label>
        <input
          id="newPass"
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          required
          minLength={8}
        />
      </div>
      <div>
        <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700">Confirm new password</label>
        <input
          id="confirmPass"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
          required
          minLength={8}
        />
      </div>
      {message && (
        <p className={`text-sm ${message === 'Password updated.' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors"
      >
        {saving ? 'Updating...' : 'Update password'}
      </button>
    </form>
  );
}
