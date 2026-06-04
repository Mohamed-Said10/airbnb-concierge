import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { UpdateNameForm, ChangePasswordForm } from './SettingsForms';

export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabaseAdmin().from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Settings</h1>

      {/* Account info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Account</h2>
        <p className="text-sm text-gray-500 mb-5">{user?.email}</p>
        <UpdateNameForm initialName={(profile as { full_name?: string } | null)?.full_name ?? ''} />
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-5">Change password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
