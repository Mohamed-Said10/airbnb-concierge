import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import AdminRegistrationsListClient from './AdminRegistrationsListClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PAGE_SIZE = 20;

interface Traveler {
  id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  id_type: string;
  id_number: string;
  date_of_birth: string;
}

interface Registration {
  id: string;
  check_in_date: string;
  check_out_date: string;
  property_ref: string | null;
  created_at: string;
  travelers: Traveler[];
}

interface RegistrationsPage {
  registrations: Registration[];
  hasNextPage: boolean;
}

async function getRegistrations(page: number): Promise<RegistrationsPage> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  const { data, error } = await supabaseAdmin()
    .from('guest_registrations')
    .select('id, check_in_date, check_out_date, property_ref, created_at, travelers(*)')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('[admin/registrations]', error);
    return { registrations: [], hasNextPage: false };
  }

  const rows = (data ?? []) as Registration[];
  return {
    registrations: rows.slice(0, PAGE_SIZE),
    hasNextPage: rows.length > PAGE_SIZE,
  };
}

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const requestedPage = Number.parseInt((await searchParams).page ?? '1', 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const { registrations, hasNextPage } = await getRegistrations(page);

  if (page > 1 && registrations.length === 0) {
    redirect('/admin/registrations');
  }

  return (
    <AdminRegistrationsListClient registrations={registrations} page={page} hasNextPage={hasNextPage} />
  );
}
