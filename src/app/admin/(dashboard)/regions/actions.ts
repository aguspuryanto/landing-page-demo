'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { writeAuditLog } from '@/lib/audit';
import { RegionSchema } from '@/lib/validation';

export type RegionFormState = { error?: string } | undefined;

function parseRegionForm(formData: FormData) {
  return RegionSchema.safeParse({
    name: formData.get('name'),
    code: formData.get('code'),
    companyId: formData.get('companyId'),
  });
}

export async function createRegion(_prevState: RegionFormState, formData: FormData): Promise<RegionFormState> {
  const session = await verifySession();
  requirePermission(session, 'company.manage_regions');

  const validated = parseRegionForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const existing = await prisma.region.findFirst({
    where: { companyId: validated.data.companyId, code: validated.data.code },
  });
  if (existing) {
    return { error: 'Kode region sudah dipakai di company ini.' };
  }

  const region = await prisma.region.create({ data: validated.data });
  await writeAuditLog({ userId: session.userId, action: 'CREATE', module: 'REGION', recordId: region.id, newValue: region });

  revalidatePath('/admin/regions');
  redirect('/admin/regions');
}

export async function updateRegion(
  id: string,
  _prevState: RegionFormState,
  formData: FormData
): Promise<RegionFormState> {
  const session = await verifySession();
  requirePermission(session, 'company.manage_regions');

  const validated = parseRegionForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const existing = await prisma.region.findFirst({
    where: { companyId: validated.data.companyId, code: validated.data.code, NOT: { id } },
  });
  if (existing) {
    return { error: 'Kode region sudah dipakai di company ini.' };
  }

  const before = await prisma.region.findUnique({ where: { id } });
  const region = await prisma.region.update({ where: { id }, data: validated.data });
  await writeAuditLog({
    userId: session.userId,
    action: 'UPDATE',
    module: 'REGION',
    recordId: id,
    oldValue: before,
    newValue: region,
  });

  revalidatePath('/admin/regions');
  redirect('/admin/regions');
}

export async function deleteRegion(id: string) {
  const session = await verifySession();
  requirePermission(session, 'company.manage_regions');

  const before = await prisma.region.findUnique({ where: { id } });
  await prisma.region.delete({ where: { id } });
  await writeAuditLog({ userId: session.userId, action: 'DELETE', module: 'REGION', recordId: id, oldValue: before });

  revalidatePath('/admin/regions');
}
