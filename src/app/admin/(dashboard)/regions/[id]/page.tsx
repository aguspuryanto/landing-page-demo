import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { RegionForm } from '../region-form';
import { updateRegion } from '../actions';

export default async function EditRegionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  requirePermission(session, 'company.manage_regions');

  const { id } = await params;
  const [region, companies] = await Promise.all([
    prisma.region.findUnique({ where: { id } }),
    prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);

  if (!region) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Edit Region</h1>
      <RegionForm action={updateRegion.bind(null, id)} companies={companies} defaultValues={region} />
    </div>
  );
}
