import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { CompanyForm } from '../company-form';
import { createCompany } from '../actions';

export default async function NewCompanyPage() {
  const session = await verifySession();
  requirePermission(session, 'platform.manage_companies');

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Tambah Company</h1>
      <CompanyForm action={createCompany} />
    </div>
  );
}
