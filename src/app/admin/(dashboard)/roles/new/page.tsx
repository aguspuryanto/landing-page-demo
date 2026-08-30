import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { RoleForm } from '../role-form';
import { createRole } from '../actions';

export default async function NewRolePage() {
  const session = await verifySession();
  requirePermission(session, 'company.manage_roles');

  const permissions = await prisma.permission.findMany({ orderBy: { module: 'asc' } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Tambah Role</h1>
      <RoleForm action={createRole} permissions={permissions} />
    </div>
  );
}
