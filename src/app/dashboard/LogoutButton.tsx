'use client';

import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left flex items-center px-3 py-2 rounded-lg text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-700 transition-colors"
    >
      Sign out
    </button>
  );
}
