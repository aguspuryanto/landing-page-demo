import Link from 'next/link';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/rbac';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteRegion } from './actions';

export default async function RegionsPage() {
  const session = await verifySession();
  requirePermission(session, 'company.manage_regions');

  const regions = await prisma.region.findMany({ include: { company: true }, orderBy: { name: 'asc' } });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Regions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Kelola region dalam tiap company.</p>
        </div>
        <Link href="/admin/regions/new" className={buttonVariants({})}>
          Tambah Region
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kode</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regions.map((region) => (
            <TableRow key={region.id}>
              <TableCell className="font-medium">{region.name}</TableCell>
              <TableCell className="text-muted-foreground">{region.code}</TableCell>
              <TableCell>{region.company?.name ?? '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/regions/${region.id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    Edit
                  </Link>
                  <form action={deleteRegion.bind(null, region.id)}>
                    <Button variant="destructive" size="sm" type="submit">
                      Hapus
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {regions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada region.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
