import { createServerSupabase } from '@/lib/supabase-server';

export async function isAuthenticatedAdmin() {
  const supabase = await createServerSupabase();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return false;
  const { data: profile, error: profileError } = await supabase
    .from('profiles').select('role').eq('id', user.id).maybeSingle();
  return !profileError && profile?.role === 'admin';
}
