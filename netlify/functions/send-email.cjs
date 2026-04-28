const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { to, subject, body, pdfBase64, fileName } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"DC XVII Invoice Generator" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: body,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Invoice Ready</h2>
          <p style="color: #666; line-height: 1.6;">${body.replace(/\n/g, '<br>')}</p>
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
          content: pdfBase64,
          encoding: 'base64',
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
