import nodemailer from 'nodemailer';

export default async (req, context) => {
  const debug = []; // Collects debug breadcrumbs for every response

  // --- CORS preflight ---
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // STEP 1: Parse request body
    debug.push('STEP 1: Parsing request body...');
    let body;
    try {
      body = await req.json();
      debug.push(`STEP 1 OK: Keys received: [${Object.keys(body).join(', ')}]`);
    } catch (parseErr) {
      debug.push(`STEP 1 FAIL: ${parseErr.message}`);
      return new Response(JSON.stringify({ error: 'Invalid JSON body', debug }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { to, subject, body: textBody, pdfBase64, fileName } = body;

    // STEP 2: Validate required fields
    debug.push('STEP 2: Validating fields...');
    if (!to || !subject || !pdfBase64) {
      debug.push('STEP 2 FAIL: Missing required fields');
      return new Response(JSON.stringify({
        error: 'Missing required fields: to, subject, pdfBase64',
        debug,
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pdfSizeKB = Math.round((pdfBase64.length * 3) / 4 / 1024);
    debug.push(`STEP 2 OK: to=${to}, pdfSize=${pdfSizeKB}KB`);

    // STEP 3: Check environment variables
    debug.push('STEP 3: Checking env vars...');
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    if (!emailUser || !emailPass) {
      debug.push(`STEP 3 FAIL: EMAIL_USER=${!!emailUser}, EMAIL_PASS=${!!emailPass}`);
      return new Response(JSON.stringify({
        error: 'Server misconfiguration: missing email credentials',
        debug,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    debug.push(`STEP 3 OK: EMAIL_USER=${emailUser}`);

    // STEP 4: Create SMTP transporter
    debug.push('STEP 4: Creating SMTP transporter...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // STEP 5: Verify SMTP connection
    debug.push('STEP 5: Verifying SMTP connection...');
    try {
      await transporter.verify();
      debug.push('STEP 5 OK: SMTP connection verified');
    } catch (verifyErr) {
      debug.push(`STEP 5 FAIL: ${verifyErr.message}`);
      return new Response(JSON.stringify({
        error: `SMTP verification failed: ${verifyErr.message}`,
        debug,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // STEP 6: Send email
    debug.push('STEP 6: Sending email...');
    const info = await transporter.sendMail({
      from: `"DC XVII Invoice Generator" <${emailUser}>`,
      to,
      subject,
      text: textBody || '',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Invoice Ready</h2>
          <p style="color: #666; line-height: 1.6;">${(textBody || '').replace(/\n/g, '<br>')}</p>
          <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #888; font-size: 14px;">The invoice PDF is attached to this email.</p>
          </div>
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">Sent via DC XVII Invoice Generator</p>
        </div>
      `,
      attachments: [
        {
          filename: fileName || 'invoice.pdf',
          content: Buffer.from(pdfBase64, 'base64'),
        },
      ],
    });

    debug.push(`STEP 6 OK: messageId=${info.messageId}`);

    return new Response(JSON.stringify({ success: true, messageId: info.messageId, debug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    debug.push(`FATAL: ${error.message}`);
    console.error('Send Email Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      debug,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
