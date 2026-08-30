import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { BranchForm } from '../branch-form';
import { updateBranch } from '../actions';

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const branch = await prisma.branch.findUnique({ where: { id } });

  if (!branch) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Edit Cabang</h1>
      <BranchForm action={updateBranch.bind(null, id)} defaultValues={branch} />
    </div>
  );
}
