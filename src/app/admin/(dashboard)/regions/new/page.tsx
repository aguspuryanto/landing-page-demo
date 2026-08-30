import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { RegionForm } from '../region-form';
import { createRegion } from '../actions';

export default async function NewRegionPage() {
  const session = await verifySession();
  requirePermission(session, 'company.manage_regions');

  const companies = await prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Tambah Region</h1>
      <RegionForm action={createRegion} companies={companies} />
    </div>
  );
}
