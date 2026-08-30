'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { writeAuditLog } from '@/lib/audit';
import { UserSchema } from '@/lib/validation';

export type UserFormState = { error?: string } | undefined;

function parseUserForm(formData: FormData) {
  return UserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    roleId: formData.get('roleId'),
    regionId: formData.get('regionId'),
    branchId: formData.get('branchId'),
    isActive: formData.get('isActive'),
  });
}

export async function createUser(_prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  const session = await verifySession();
  requirePermission(session, 'company.manage_users');

  const validated = parseUserForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }
  if (!validated.data.password) {
    return { error: 'Password wajib diisi untuk user baru.' };
  }

  const existing = await prisma.user.findUnique({ where: { email: validated.data.email } });
  if (existing) {
    return { error: 'Email sudah dipakai user lain.' };
  }

  const hashedPassword = await bcrypt.hash(validated.data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: validated.data.name,
      email: validated.data.email,
      password: hashedPassword,
      companyId: session.companyId,
      regionId: validated.data.regionId || null,
      branchId: validated.data.branchId || null,
      roleId: validated.data.roleId,
      isActive: validated.data.isActive ?? true,
    },
  });
  await writeAuditLog({ userId: session.userId, action: 'CREATE', module: 'USER', recordId: user.id, newValue: { ...user, password: undefined } });

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function updateUser(
  id: string,
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const session = await verifySession();
  requirePermission(session, 'company.manage_users');

  const validated = parseUserForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const existing = await prisma.user.findUnique({ where: { email: validated.data.email } });
  if (existing && existing.id !== id) {
    return { error: 'Email sudah dipakai user lain.' };
  }

  const before = await prisma.user.findUnique({ where: { id } });

  const data: Record<string, unknown> = {
    name: validated.data.name,
    email: validated.data.email,
    regionId: validated.data.regionId || null,
    branchId: validated.data.branchId || null,
    roleId: validated.data.roleId,
    isActive: validated.data.isActive ?? true,
  };
  if (validated.data.password) {
    data.password = await bcrypt.hash(validated.data.password, 10);
  }

  const user = await prisma.user.update({ where: { id }, data });
  await writeAuditLog({
    userId: session.userId,
    action: 'UPDATE',
    module: 'USER',
    recordId: id,
    oldValue: before ? { ...before, password: undefined } : null,
    newValue: { ...user, password: undefined },
  });

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function deleteUser(id: string) {
  const session = await verifySession();
  requirePermission(session, 'company.manage_users');

  if (id === session.userId) {
    return;
  }

  const before = await prisma.user.findUnique({ where: { id } });
  await prisma.user.delete({ where: { id } });
  await writeAuditLog({
    userId: session.userId,
    action: 'DELETE',
    module: 'USER',
    recordId: id,
    oldValue: before ? { ...before, password: undefined } : null,
  });

  revalidatePath('/admin/users');
}
