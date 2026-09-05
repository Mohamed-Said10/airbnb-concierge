'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { useLanguage } from '@/context/LanguageContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const { language } = useLanguage();
  const french = language === 'fr';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createBrowserSupabase();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-primary-600">KoziBnB</Link>
          <h1 className="mt-2 text-xl font-bold text-gray-900">{french ? 'Connectez-vous à votre compte' : 'Sign in to your account'}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {french ? "Vous n'avez pas de compte ?" : "Don't have an account?"}{' '}
            <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-primary-600 hover:underline font-medium">
              {french ? "S'inscrire" : 'Sign up'}
            </Link>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{french ? 'E-mail' : 'Email'}</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                required autoFocus />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">{french ? 'Mot de passe' : 'Password'}</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-primary-600 hover:underline">
                {french ? 'Mot de passe oublié ?' : 'Forgot password?'}
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {loading ? (french ? 'Connexion...' : 'Signing in...') : (french ? 'Se connecter' : 'Sign in')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
