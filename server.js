import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/send-invoice', async (req, res) => {
  const { to, subject, body, pdfBase64, fileName } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Invoice Generator <onboarding@resend.dev>',
      to: to.split(','),
      subject: subject,
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
        },
      ],
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Resend Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
