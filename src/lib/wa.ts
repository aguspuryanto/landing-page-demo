import 'server-only';

export type SendWhatsAppResult = { ok: true } | { ok: false; error: string };

/**
 * Sends a WhatsApp message via Fonnte (https://fonnte.com/) using the device
 * token configured in FONNTE_TOKEN. Fonnte expects the target phone number
 * without a leading "+".
 */
export async function sendWhatsApp(to: string, message: string): Promise<SendWhatsAppResult> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    return { ok: false, error: 'FONNTE_TOKEN belum dikonfigurasi.' };
  }

  const target = to.replace(/[^0-9]/g, '');

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ target, message }),
    });

    const data = (await res.json().catch(() => null)) as { status?: boolean; reason?: string } | null;

    if (!res.ok || !data?.status) {
      return { ok: false, error: data?.reason ?? `Fonnte merespons dengan status ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gagal mengirim pesan WhatsApp.' };
  }
}
