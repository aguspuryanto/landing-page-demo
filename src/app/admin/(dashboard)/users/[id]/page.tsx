import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { UserForm } from '../user-form';
import { updateUser } from '../actions';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  requirePermission(session, 'company.manage_users');

  const { id } = await params;
  const [user, roles, regions, branches] = await Promise.all([
    prisma.user.findUnique({ where: { id } }),
    prisma.role.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.region.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.branch.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Edit User</h1>
      <UserForm
        action={updateUser.bind(null, id)}
        roles={roles}
        regions={regions}
        branches={branches}
        isEdit
        defaultValues={user}
      />
    </div>
  );
}
