'use client';

import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { useLanguage } from '@/context/LanguageContext';

export function UpdateNameForm({ initialName }: { initialName: string }) {
  const { language } = useLanguage();
  const french = language === 'fr';
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (error) {
      setSuccess(false);
      setMessage(error.message);
    } else {
      await supabase.from('profiles').update({ full_name: name }).eq('id', (await supabase.auth.getUser()).data.user!.id);
      setSuccess(true);
      setMessage(french ? 'Nom mis à jour.' : 'Name updated.');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{french ? 'Nom complet' : 'Full name'}</label>
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
        <p className={`text-sm ${success ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors"
      >
        {saving ? (french ? 'Enregistrement...' : 'Saving...') : (french ? 'Enregistrer le nom' : 'Save name')}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const { language } = useLanguage();
  const french = language === 'fr';
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      setSuccess(false);
      setMessage(french ? 'Les nouveaux mots de passe ne correspondent pas.' : 'New passwords do not match.');
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
      setSuccess(false);
      setMessage(french ? 'Le mot de passe actuel est incorrect.' : 'Current password is incorrect.');
      setSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) {
      setSuccess(false);
      setMessage(error.message);
    } else {
      setSuccess(true);
      setMessage(french ? 'Mot de passe mis à jour.' : 'Password updated.');
      setCurrent(''); setNext(''); setConfirm('');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="current" className="block text-sm font-medium text-gray-700">{french ? 'Mot de passe actuel' : 'Current password'}</label>
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
        <label htmlFor="newPass" className="block text-sm font-medium text-gray-700">{french ? 'Nouveau mot de passe' : 'New password'}</label>
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
        <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700">{french ? 'Confirmer le nouveau mot de passe' : 'Confirm new password'}</label>
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
        <p className={`text-sm ${success ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors"
      >
        {saving ? (french ? 'Mise à jour...' : 'Updating...') : (french ? 'Mettre à jour le mot de passe' : 'Update password')}
      </button>
    </form>
  );
}
