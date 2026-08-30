'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { writeAuditLog } from '@/lib/audit';
import { RoleSchema } from '@/lib/validation';

export type RoleFormState = { error?: string } | undefined;

function parseRoleForm(formData: FormData) {
  return RoleSchema.safeParse({
    name: formData.get('name'),
    permissionIds: formData.getAll('permissionIds'),
  });
}

export async function createRole(_prevState: RoleFormState, formData: FormData): Promise<RoleFormState> {
  const session = await verifySession();
  requirePermission(session, 'company.manage_roles');

  const validated = parseRoleForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const role = await prisma.role.create({
    data: {
      name: validated.data.name,
      companyId: session.companyId,
      isSystem: false,
      permissions: { create: validated.data.permissionIds.map((permissionId) => ({ permissionId })) },
    },
  });
  await writeAuditLog({ userId: session.userId, action: 'CREATE', module: 'ROLE', recordId: role.id, newValue: role });

  revalidatePath('/admin/roles');
  redirect('/admin/roles');
}

export async function updateRole(
  id: string,
  _prevState: RoleFormState,
  formData: FormData
): Promise<RoleFormState> {
  const session = await verifySession();
  requirePermission(session, 'company.manage_roles');

  const validated = parseRoleForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const before = await prisma.role.findUnique({ where: { id }, include: { permissions: true } });
  const role = await prisma.role.update({
    where: { id },
    data: {
      name: validated.data.name,
      permissions: {
        deleteMany: {},
        create: validated.data.permissionIds.map((permissionId) => ({ permissionId })),
      },
    },
  });
  await writeAuditLog({
    userId: session.userId,
    action: 'UPDATE',
    module: 'ROLE',
    recordId: id,
    oldValue: before,
    newValue: role,
  });

  revalidatePath('/admin/roles');
  redirect('/admin/roles');
}

export async function deleteRole(id: string) {
  const session = await verifySession();
  requirePermission(session, 'company.manage_roles');

  const before = await prisma.role.findUnique({ where: { id } });
  await prisma.role.delete({ where: { id } });
  await writeAuditLog({ userId: session.userId, action: 'DELETE', module: 'ROLE', recordId: id, oldValue: before });

  revalidatePath('/admin/roles');
}
