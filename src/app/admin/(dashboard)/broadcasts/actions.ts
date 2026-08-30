'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { BroadcastComposeSchema } from '@/lib/validation';
import { sendWhatsApp } from '@/lib/wa';
import { sendBroadcastEmail } from '@/lib/email';

export type BroadcastFormState = { error?: string; success?: string } | undefined;

export async function createAndSendCampaign(
  _prevState: BroadcastFormState,
  formData: FormData
): Promise<BroadcastFormState> {
  const session = await verifySession();

  const validated = BroadcastComposeSchema.safeParse({
    type: formData.get('type'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    filterBranchId: formData.get('filterBranchId'),
    filterStatus: formData.get('filterStatus'),
  });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const { type, subject, message, filterBranchId, filterStatus } = validated.data;

  const targets = await prisma.customer.findMany({
    where: {
      branchId: filterBranchId || undefined,
      status: (filterStatus as never) || undefined,
      ...(type === 'EMAIL' ? { email: { not: null } } : {}),
    },
  });

  if (targets.length === 0) {
    return { error: 'Tidak ada customer yang cocok dengan filter target.' };
  }

  const campaign = await prisma.broadcastCampaign.create({
    data: {
      type,
      subject: subject || null,
      message,
      filterBranchId: filterBranchId || null,
      filterStatus: (filterStatus as never) || null,
      status: 'SENDING',
      createdById: session.userId,
      logs: {
        create: targets.map((customer) => ({ customerId: customer.id, status: 'PENDING' as const })),
      },
    },
    include: { logs: true },
  });

  let sentCount = 0;

  for (const customer of targets) {
    const log = campaign.logs.find((l) => l.customerId === customer.id);
    if (!log) continue;

    const result =
      type === 'WHATSAPP'
        ? await sendWhatsApp(customer.phone, message)
        : await sendBroadcastEmail(customer.email as string, subject || 'Informasi', message);

    if (result.ok) {
      sentCount += 1;
      await prisma.broadcastLog.update({
        where: { id: log.id },
        data: { status: 'SENT', sentAt: new Date() },
      });
    } else {
      await prisma.broadcastLog.update({
        where: { id: log.id },
        data: { status: 'FAILED', error: result.error },
      });
    }
  }

  await prisma.broadcastCampaign.update({
    where: { id: campaign.id },
    data: { status: sentCount > 0 ? 'SENT' : 'FAILED' },
  });

  revalidatePath('/admin/broadcasts');
  return { success: `Terkirim ke ${sentCount} dari ${targets.length} customer.` };
}
