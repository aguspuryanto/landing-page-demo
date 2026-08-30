import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { UserForm } from '../user-form';
import { createUser } from '../actions';

export default async function NewUserPage() {
  const session = await verifySession();
  requirePermission(session, 'company.manage_users');

  const [roles, regions, branches] = await Promise.all([
    prisma.role.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.region.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.branch.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Tambah User</h1>
      <UserForm action={createUser} roles={roles} regions={regions} branches={branches} />
    </div>
  );
}
