import 'server-only';
import { Resend } from 'resend';

export type SendEmailResult = { ok: true } | { ok: false; error: string };

export async function sendBroadcastEmail(
  to: string,
  subject: string,
  html: string
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { ok: false, error: 'RESEND_API_KEY / RESEND_FROM_EMAIL belum dikonfigurasi.' };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, subject, html });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal mengirim email.' };
  }
}
