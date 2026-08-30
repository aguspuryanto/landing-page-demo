import { BranchForm } from '../branch-form';
import { createBranch } from '../actions';

export default function NewBranchPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Tambah Cabang</h1>
      <BranchForm action={createBranch} />
    </div>
  );
}
