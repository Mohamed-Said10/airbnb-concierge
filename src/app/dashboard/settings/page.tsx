import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { UpdateNameForm, ChangePasswordForm } from './SettingsForms';
import { SettingsTitle, AccountLabel, ChangePasswordLabel } from './SettingsHeader';

export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabaseAdmin().from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null };

  return (
    <div className="p-4 sm:p-8 max-w-xl">
      <SettingsTitle />

      {/* Account info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <AccountLabel />
        <p className="text-sm text-gray-500 mb-5">{user?.email}</p>
        <UpdateNameForm initialName={(profile as { full_name?: string } | null)?.full_name ?? ''} />
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ChangePasswordLabel />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
