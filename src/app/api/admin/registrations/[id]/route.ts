import { NextRequest, NextResponse } from 'next/server';
import { deleteRegistration } from '@/lib/delete-registration';
import { isAuthenticatedAdmin } from '@/lib/admin-access';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteRegistration(id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin/registration/delete]', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
