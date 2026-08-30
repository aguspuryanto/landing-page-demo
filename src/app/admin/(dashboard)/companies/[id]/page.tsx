import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { CompanyForm } from '../company-form';
import { updateCompany } from '../actions';

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  requirePermission(session, 'platform.manage_companies');

  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id } });

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Edit Company</h1>
      <CompanyForm action={updateCompany.bind(null, id)} defaultValues={company} />
    </div>
  );
}
