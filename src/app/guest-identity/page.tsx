import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import GuestRegistrationForm from '@/components/GuestRegistrationForm';

export const dynamic = 'force-dynamic';

export default async function GuestIdentityPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/guest-identity');

  return <GuestRegistrationForm />;
}
