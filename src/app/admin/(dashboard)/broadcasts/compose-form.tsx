'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerStatusValues } from '@/lib/validation';
import { createAndSendCampaign, type BroadcastFormState } from './actions';

type Branch = { id: string; name: string };

const STATUS_LABEL: Record<string, string> = {
  NEW: 'Baru',
  CONTACTED: 'Dihubungi',
  QUALIFIED: 'Prospek',
  CONVERTED: 'Konversi',
  LOST: 'Hilang',
};

export function ComposeForm({ branches }: { branches: Branch[] }) {
  const [state, formAction, pending] = useActionState<BroadcastFormState, FormData>(
    createAndSendCampaign,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="type">Tipe Broadcast</Label>
        <Select name="type" defaultValue="WHATSAPP">
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subjek (untuk Email)</Label>
        <Input id="subject" name="subject" placeholder="Promo bulan ini" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Isi Pesan</Label>
        <Textarea id="message" name="message" required rows={5} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="filterBranchId">Target Cabang (opsional)</Label>
          <Select name="filterBranchId">
            <SelectTrigger id="filterBranchId">
              <SelectValue placeholder="Semua cabang" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filterStatus">Target Status (opsional)</Label>
          <Select name="filterStatus">
            <SelectTrigger id="filterStatus">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              {CustomerStatusValues.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-600">{state.success}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Mengirim...' : 'Kirim Broadcast'}
      </Button>
    </form>
  );
}
