import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const db = supabaseAdmin();

    const checkInDate = formData.get('checkInDate') as string;
    const checkOutDate = formData.get('checkOutDate') as string;
    const signatureDataUrl = formData.get('signature') as string;
    const travelersJson = formData.get('travelers') as string;
    const propertyRef = (formData.get('propertyRef') as string) || null;

    if (!checkInDate || !checkOutDate || !signatureDataUrl || !travelersJson) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload signature (base64 → Buffer)
    const signatureBase64 = signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const signatureBuffer = Buffer.from(signatureBase64, 'base64');
    const signaturePath = `signatures/${Date.now()}.png`;

    const { error: sigUploadError } = await db.storage
      .from('guest-id-photos')
      .upload(signaturePath, signatureBuffer, { contentType: 'image/png', upsert: false });

    if (sigUploadError) throw sigUploadError;

    const { data: sigUrlData } = db.storage
      .from('guest-id-photos')
      .getPublicUrl(signaturePath);

    // Insert registration row
    const { data: registration, error: regError } = await db
      .from('guest_registrations')
      .insert({ check_in_date: checkInDate, check_out_date: checkOutDate, signature_url: sigUrlData.publicUrl, property_ref: propertyRef })
      .select('id')
      .single();

    if (regError || !registration) throw regError ?? new Error('Registration insert failed');

    // Process each traveler
    const travelers: Array<{
      firstName: string; lastName: string; dateOfBirth: string;
      placeOfBirth: string; nationality: string; idType: string;
      idNumber: string; idExpiryDate: string; address: string;
    }> = JSON.parse(travelersJson);

    const travelerRows = await Promise.all(
      travelers.map(async (t, idx) => {
        const frontFile = formData.get(`frontPhoto_${idx}`) as File;
        const frontPath = `id-photos/${registration.id}/${idx}-front-${Date.now()}.${frontFile.name.split('.').pop()}`;
        const frontBuffer = Buffer.from(await frontFile.arrayBuffer());

        const { error: frontErr } = await db.storage
          .from('guest-id-photos')
          .upload(frontPath, frontBuffer, { contentType: frontFile.type, upsert: false });
        if (frontErr) throw frontErr;

        const { data: frontUrl } = db.storage.from('guest-id-photos').getPublicUrl(frontPath);

        let backPhotoUrl: string | null = null;
        const backFile = formData.get(`backPhoto_${idx}`) as File | null;
        if (backFile) {
          const backPath = `id-photos/${registration.id}/${idx}-back-${Date.now()}.${backFile.name.split('.').pop()}`;
          const backBuffer = Buffer.from(await backFile.arrayBuffer());
          const { error: backErr } = await db.storage
            .from('guest-id-photos')
            .upload(backPath, backBuffer, { contentType: backFile.type, upsert: false });
          if (backErr) throw backErr;
          const { data: backUrl } = db.storage.from('guest-id-photos').getPublicUrl(backPath);
          backPhotoUrl = backUrl.publicUrl;
        }

        return {
          registration_id: registration.id,
          first_name: t.firstName,
          last_name: t.lastName,
          date_of_birth: t.dateOfBirth,
          place_of_birth: t.placeOfBirth,
          nationality: t.nationality,
          id_type: t.idType,
          id_number: t.idNumber,
          id_expiry_date: t.idExpiryDate,
          address: t.address,
          id_front_photo_url: frontUrl.publicUrl,
          id_back_photo_url: backPhotoUrl,
        };
      })
    );

    const { error: travelersError } = await db.from('travelers').insert(travelerRows);
    if (travelersError) throw travelersError;

    return NextResponse.json({ success: true, registrationId: registration.id }, { status: 201 });
  } catch (err) {
    console.error('[guest-identity] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
