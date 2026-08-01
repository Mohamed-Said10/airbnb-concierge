'use client';

import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createBrowserSupabase();
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !data.user) throw new Error('invalid_credentials');
      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('role').eq('id', data.user.id).maybeSingle();
      if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut();
        setError('This account does not have administrator access.');
        return;
      }
      window.location.replace('/admin');
    } catch {
      setError('Email or password is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-extrabold text-primary-600">KoziBnB</span>
          <p className="mt-1 text-sm text-gray-500">Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
              required autoComplete="email" autoFocus />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
