'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { useLanguage } from '@/context/LanguageContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const french = language === 'fr';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError(french ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    const supabase = createBrowserSupabase();
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-primary-600">KoziBnB</Link>
          <h1 className="mt-2 text-xl font-bold text-gray-900">{french ? 'Définir un nouveau mot de passe' : 'Set new password'}</h1>
          <p className="mt-1 text-sm text-gray-500">{french ? 'Choisissez un mot de passe fort pour votre compte.' : 'Choose a strong password for your account.'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">{french ? 'Nouveau mot de passe' : 'New password'}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                required
                minLength={8}
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">{french ? 'Au moins 8 caractères' : 'At least 8 characters'}</p>
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">{french ? 'Confirmer le mot de passe' : 'Confirm password'}</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                required
                minLength={8}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors"
            >
              {loading ? (french ? 'Mise à jour...' : 'Updating...') : (french ? 'Mettre à jour le mot de passe' : 'Update password')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
