import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { deleteRegistration } from '@/lib/delete-registration';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const deleted = await deleteRegistration(id, user.id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[owner/registration/delete]', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
