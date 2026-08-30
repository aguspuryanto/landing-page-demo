import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { CustomerForm } from '../customer-form';
import { updateCustomer } from '../actions';

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [customer, branches] = await Promise.all([
    prisma.customer.findUnique({ where: { id } }),
    prisma.branch.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Edit Customer</h1>
      <CustomerForm action={updateCustomer.bind(null, id)} branches={branches} defaultValues={customer} />
    </div>
  );
}
