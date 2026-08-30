import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { RoleForm } from '../role-form';
import { updateRole } from '../actions';

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  requirePermission(session, 'company.manage_roles');

  const { id } = await params;
  const [role, permissions] = await Promise.all([
    prisma.role.findUnique({ where: { id }, include: { permissions: { include: { permission: true } } } }),
    prisma.permission.findMany({ orderBy: { module: 'asc' } }),
  ]);

  if (!role) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Edit Role — {role.name}</h1>
      <RoleForm
        action={updateRole.bind(null, id)}
        permissions={permissions}
        defaultValues={{
          name: role.name,
          isSystem: role.isSystem,
          permissionIds: role.permissions.map((p) => p.permissionId),
        }}
      />
    </div>
  );
}
