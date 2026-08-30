import { prisma } from '@/lib/db';
import { CustomerForm } from '../customer-form';
import { createCustomer } from '../actions';

export default async function NewCustomerPage() {
  const branches = await prisma.branch.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Tambah Customer</h1>
      <CustomerForm action={createCustomer} branches={branches} />
    </div>
  );
}
