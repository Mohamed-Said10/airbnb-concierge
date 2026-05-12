import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendEmail } from '@/lib/brevo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, propertyType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
      .from('contact_leads')
      .insert({ name, email, phone: phone || null, property_type: propertyType || null, message });

    if (error) throw error;

    // Email notification to owner
    const ownerEmail = process.env.OWNER_EMAIL;
    if (ownerEmail) {
      await sendEmail({
        to: [{ email: ownerEmail, name: 'KoziBnB' }],
        subject: `New Contact Lead — ${name}`,
        htmlContent: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${propertyType ? `<p><strong>Property type:</strong> ${propertyType}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/leads">View in admin dashboard</a></p>
        `,
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[contact] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
