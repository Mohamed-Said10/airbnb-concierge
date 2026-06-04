import { createServerSupabase } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

interface RecentReg { id: string; check_in_date: string; check_out_date: string; created_at: string; }
interface PropertyRow { id: string; name: string; slug: string; }

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = supabaseAdmin();

  // Get user's properties
  const { data: properties } = await db
    .from('properties')
    .select('id, name, slug, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  const propertyIds = (properties ?? []).map((p: { id: string }) => p.id);

  // Count registrations across all properties
  const { count: regCount } = propertyIds.length
    ? await db
        .from('guest_registrations')
        .select('*', { count: 'exact', head: true })
        .in('property_id', propertyIds)
    : { count: 0 };

  // Recent registrations
  const { data: recentRegs } = propertyIds.length
    ? await db
        .from('guest_registrations')
        .select('id, check_in_date, check_out_date, created_at, properties(name)')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: [] };

  // Onboarding: no properties yet
  if ((properties ?? []).length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to KoziBnB</h2>
        <p className="text-gray-500 text-sm max-w-sm mb-6">
          Add your first property to get started. You&apos;ll get a unique guest registration link to share with arriving guests.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-sm w-full text-left space-y-3 mb-6">
          {[
            'Add your property with a name and address',
            'Share the guest registration link before check-in',
            'Guests fill in their info and sign digitally',
            'You receive an email and can view all registrations here',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-sm text-gray-700">{step}</p>
            </div>
          ))}
        </div>
        <a href="/dashboard/properties"
          className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
          Add your first property →
        </a>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Overview</h1>
      <p className="text-sm text-gray-500 mb-8">{user.email}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-10 max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Properties</p>
          <p className="mt-2 text-4xl font-extrabold text-primary-600">{(properties ?? []).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Registrations</p>
          <p className="mt-2 text-4xl font-extrabold text-amber-600">{regCount ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Properties */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Your Properties</h2>
            <Link href="/dashboard/properties" className="text-xs text-primary-600 hover:underline">Manage</Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {(properties ?? []).length === 0 ? (
              <li className="px-6 py-6 text-center">
                <p className="text-sm text-gray-400 mb-3">No properties yet.</p>
                <Link href="/dashboard/properties"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                  Add your first property
                </Link>
              </li>
            ) : (properties ?? []).map((p: PropertyRow) => (
              <li key={p.id} className="px-6 py-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">{p.name}</p>
                <a href={`/register/${p.slug}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:underline">
                  Guest link ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent registrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Registrations</h2>
            <Link href="/dashboard/registrations" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {(recentRegs ?? []).length === 0 ? (
              <li className="px-6 py-4 text-sm text-gray-400">No registrations yet.</li>
            ) : (recentRegs ?? []).map((r) => {
              const reg = r as unknown as RecentReg;
              return (
                <li key={reg.id} className="px-6 py-3">
                  <p className="text-sm font-medium text-gray-800">{reg.check_in_date} → {reg.check_out_date}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(reg.created_at).toLocaleString()}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
