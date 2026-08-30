import Link from 'next/link';
import { prisma } from '@/lib/db';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function LandingPagesPage() {
  const branches = await prisma.branch.findMany({
    include: { landingPage: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Landing Page per Cabang</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kelola konten dan status publikasi landing page tiap cabang.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cabang</TableHead>
            <TableHead>URL Publik</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell className="font-medium">{branch.name}</TableCell>
              <TableCell className="text-muted-foreground">/{branch.slug}</TableCell>
              <TableCell>
                {branch.landingPage?.published ? (
                  <Badge variant="success">Published</Badge>
                ) : (
                  <Badge variant="secondary">Draft</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/admin/landing-pages/${branch.id}`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Edit Konten
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {branches.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada cabang. Tambahkan cabang terlebih dahulu.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
