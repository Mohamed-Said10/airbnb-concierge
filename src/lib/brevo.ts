interface EmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  // Distinct from OWNER_EMAIL (the notification recipient) — this must be an
  // address verified as a sender in Brevo, or every send is rejected.
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    console.warn('[brevo] BREVO_API_KEY or BREVO_SENDER_EMAIL not set — skipping email');
    return;
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'KoziBnB', email: senderEmail },
      to: options.to,
      subject: options.subject,
      htmlContent: options.htmlContent,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[brevo] send failed:', text);
  }
}
