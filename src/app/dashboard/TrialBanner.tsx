'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { useLanguage } from '@/context/LanguageContext';

export default function TrialBanner() {
  const { language } = useLanguage();
  const french = language === 'fr';
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createBrowserSupabase();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from('profiles').select('trial_ends_at').eq('id', user.id).maybeSingle()
        .then(({ data }) => {
          if (!active || !data?.trial_ends_at) return;
          const diffMs = new Date(data.trial_ends_at).getTime() - Date.now();
          setDaysLeft(Math.ceil(diffMs / 86_400_000));
        });
    });
    return () => { active = false; };
  }, []);

  // No trial_ends_at on the profile (pre-trial-feature accounts) — show nothing.
  if (daysLeft === null) return null;

  const expired = daysLeft <= 0;

  return (
    <div className={`px-4 py-2.5 text-center text-sm font-medium ${
      expired ? 'border-b border-amber-200 bg-amber-50 text-amber-800' : 'border-b border-primary-100 bg-primary-50 text-primary-700'
    }`}>
      {expired
        ? (french ? 'Votre essai gratuit est terminé.' : 'Your free trial has ended.')
        : (french
            ? `Il vous reste ${daysLeft} jour${daysLeft > 1 ? 's' : ''} d'essai gratuit.`
            : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your free trial.`)}
    </div>
  );
}
