'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { writeAuditLog } from '@/lib/audit';
import { CompanySchema } from '@/lib/validation';

export type CompanyFormState = { error?: string } | undefined;

function parseCompanyForm(formData: FormData) {
  return CompanySchema.safeParse({
    name: formData.get('name'),
    code: formData.get('code'),
  });
}

export async function createCompany(_prevState: CompanyFormState, formData: FormData): Promise<CompanyFormState> {
  const session = await verifySession();
  requirePermission(session, 'platform.manage_companies');

  const validated = parseCompanyForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const existing = await prisma.company.findFirst({ where: { code: validated.data.code } });
  if (existing) {
    return { error: 'Kode sudah dipakai company lain.' };
  }

  const company = await prisma.company.create({ data: validated.data });
  await writeAuditLog({ userId: session.userId, action: 'CREATE', module: 'COMPANY', recordId: company.id, newValue: company });

  revalidatePath('/admin/companies');
  redirect('/admin/companies');
}

export async function updateCompany(
  id: string,
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const session = await verifySession();
  requirePermission(session, 'platform.manage_companies');

  const validated = parseCompanyForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const existing = await prisma.company.findFirst({ where: { code: validated.data.code, NOT: { id } } });
  if (existing) {
    return { error: 'Kode sudah dipakai company lain.' };
  }

  const before = await prisma.company.findUnique({ where: { id } });
  const company = await prisma.company.update({ where: { id }, data: validated.data });
  await writeAuditLog({
    userId: session.userId,
    action: 'UPDATE',
    module: 'COMPANY',
    recordId: id,
    oldValue: before,
    newValue: company,
  });

  revalidatePath('/admin/companies');
  redirect('/admin/companies');
}

export async function deleteCompany(id: string) {
  const session = await verifySession();
  requirePermission(session, 'platform.manage_companies');

  const before = await prisma.company.findUnique({ where: { id } });
  await prisma.company.delete({ where: { id } });
  await writeAuditLog({ userId: session.userId, action: 'DELETE', module: 'COMPANY', recordId: id, oldValue: before });

  revalidatePath('/admin/companies');
}
