import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteBranch } from './actions';

export default async function BranchesPage() {
  const branches = await prisma.branch.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { customers: true } }, region: { select: { name: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cabang</h1>
          <p className="mt-1 text-sm text-muted-foreground">Kelola daftar cabang dan lihat jumlah customer tiap cabang.</p>
        </div>
        <Link href="/admin/branches/new" className={buttonVariants({})}>
          Tambah Cabang
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Kota</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell className="font-medium">{branch.name}</TableCell>
              <TableCell className="text-muted-foreground">{branch.region?.name ?? '-'}</TableCell>
              <TableCell className="text-muted-foreground">/{branch.slug}</TableCell>
              <TableCell>{branch.city ?? '-'}</TableCell>
              <TableCell>{branch._count.customers}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/branches/${branch.id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    Edit
                  </Link>
                  <form action={deleteBranch.bind(null, branch.id)}>
                    <Button variant="destructive" size="sm" type="submit">
                      Hapus
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {branches.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada cabang.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
