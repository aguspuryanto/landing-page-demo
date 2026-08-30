import { Users, Building2, Send, CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';

export default async function DashboardPage() {
  const [customerCount, branchCount, campaignCount, sentLogCount] = await Promise.all([
    prisma.customer.count(),
    prisma.branch.count(),
    prisma.broadcastCampaign.count(),
    prisma.broadcastLog.count({ where: { status: 'SENT' } }),
  ]);

  const stats = [
    { label: 'Total Customer', value: customerCount, icon: Users },
    { label: 'Total Cabang', value: branchCount, icon: Building2 },
    { label: 'Campaign Broadcast', value: campaignCount, icon: Send },
    { label: 'Pesan Terkirim', value: sentLogCount, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ringkasan aktivitas CRM secara keseluruhan.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-[0_2px_16px_rgba(10,17,40,0.06)]">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
