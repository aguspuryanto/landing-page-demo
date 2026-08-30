import { prisma } from '@/lib/db';
import { BranchForm } from '../branch-form';
import { createBranch } from '../actions';

export default async function NewBranchPage() {
  const regions = await prisma.region.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Tambah Cabang</h1>
      <BranchForm action={createBranch} regions={regions} />
    </div>
  );
}
