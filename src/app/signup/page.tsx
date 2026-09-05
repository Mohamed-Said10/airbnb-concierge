'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { useLanguage } from '@/context/LanguageContext';

function SignupForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const { language } = useLanguage();
  const french = language === 'fr';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createBrowserSupabase();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{french ? 'Vérifiez votre e-mail' : 'Check your email'}</h2>
          <p className="text-gray-500 text-sm">
            {french ? (
              <>Nous avons envoyé un lien de confirmation à <strong>{email}</strong>. Cliquez dessus pour activer votre compte.</>
            ) : (
              <>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-primary-600">KoziBnB</Link>
          <h1 className="mt-2 text-xl font-bold text-gray-900">{french ? 'Créez votre compte' : 'Create your account'}</h1>
          <p className="mt-1 text-sm font-medium text-primary-600">
            {french ? "Profitez d'un essai gratuit de 3 mois — sans carte bancaire." : 'Start with a free 3-month trial — no credit card required.'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {french ? 'Vous avez déjà un compte ?' : 'Already have an account?'}{' '}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-primary-600 hover:underline font-medium">
              {french ? 'Se connecter' : 'Sign in'}
            </Link>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{french ? 'Nom complet' : 'Full name'}</label>
              <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                required autoFocus />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{french ? 'E-mail' : 'Email'}</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">{french ? 'Mot de passe' : 'Password'}</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                required minLength={8} />
              <p className="text-xs text-gray-400 mt-1">{french ? 'Au moins 8 caractères' : 'At least 8 characters'}</p>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {loading ? (french ? 'Création du compte...' : 'Creating account...') : (french ? "Démarrer l'essai gratuit" : 'Start free trial')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
