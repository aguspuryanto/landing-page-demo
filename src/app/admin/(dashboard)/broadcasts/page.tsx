import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ComposeForm } from './compose-form';

const STATUS_VARIANT: Record<string, 'secondary' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  SENDING: 'warning',
  SENT: 'success',
  FAILED: 'destructive',
};

export default async function BroadcastsPage() {
  const [branches, campaigns] = await Promise.all([
    prisma.branch.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.broadcastCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { _count: { select: { logs: true } }, createdBy: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Broadcast</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kirim broadcast WhatsApp atau Email ke customer, dan pantau riwayatnya.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Broadcast Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <ComposeForm branches={branches} />
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipe</TableHead>
            <TableHead>Pesan</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Dibuat oleh</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.type === 'WHATSAPP' ? 'WhatsApp' : 'Email'}</TableCell>
              <TableCell className="max-w-xs truncate">{campaign.message}</TableCell>
              <TableCell>{campaign._count.logs} customer</TableCell>
              <TableCell>{campaign.createdBy.name}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[campaign.status]}>{campaign.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
          {campaigns.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Belum ada campaign broadcast.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
