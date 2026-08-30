import Link from 'next/link';
import { prisma } from '@/lib/db';
import { buttonVariants, Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteCustomer } from './actions';

const STATUS_LABEL: Record<string, string> = {
  NEW: 'Baru',
  CONTACTED: 'Dihubungi',
  QUALIFIED: 'Prospek',
  CONVERTED: 'Konversi',
  LOST: 'Hilang',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  NEW: 'secondary',
  CONTACTED: 'warning',
  QUALIFIED: 'default',
  CONVERTED: 'success',
  LOST: 'destructive',
};

type SearchParams = { branchId?: string; status?: string };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { branchId, status } = await searchParams;

  const [customers, branches] = await Promise.all([
    prisma.customer.findMany({
      where: {
        branchId: branchId || undefined,
        status: (status as never) || undefined,
      },
      include: { branch: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.branch.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer</h1>
          <p className="mt-1 text-sm text-muted-foreground">Kelola data customer dan status prospek tiap cabang.</p>
        </div>
        <Link href="/admin/customers/new" className={buttonVariants({})}>
          Tambah Customer
        </Link>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Link
          href="/admin/customers"
          className={buttonVariants({ variant: !branchId && !status ? 'default' : 'outline', size: 'sm' })}
        >
          Semua
        </Link>
        {branches.map((branch) => (
          <Link
            key={branch.id}
            href={`/admin/customers?branchId=${branch.id}`}
            className={buttonVariants({ variant: branchId === branch.id ? 'default' : 'outline', size: 'sm' })}
          >
            {branch.name}
          </Link>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Cabang</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
              <TableCell>{customer.branch?.name ?? '-'}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[customer.status]}>{STATUS_LABEL[customer.status]}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/customers/${customer.id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    Edit
                  </Link>
                  <form action={deleteCustomer.bind(null, customer.id)}>
                    <Button variant="destructive" size="sm" type="submit">
                      Hapus
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Belum ada customer.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
