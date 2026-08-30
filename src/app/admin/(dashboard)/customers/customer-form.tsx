'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerStatusValues } from '@/lib/validation';
import type { CustomerFormState } from './actions';

type Branch = { id: string; name: string };

type Props = {
  action: (state: CustomerFormState, formData: FormData) => Promise<CustomerFormState>;
  branches: Branch[];
  defaultValues?: {
    name: string;
    phone: string;
    email: string | null;
    status: string;
    notes: string | null;
    source: string | null;
    branchId: string | null;
  };
};

const STATUS_LABEL: Record<string, string> = {
  NEW: 'Baru',
  CONTACTED: 'Dihubungi',
  QUALIFIED: 'Prospek',
  CONVERTED: 'Konversi',
  LOST: 'Hilang',
};

export function CustomerForm({ action, branches, defaultValues }: Props) {
  const [state, formAction, pending] = useActionState<CustomerFormState, FormData>(action, undefined);

  return (
    <Card className="max-w-xl">
      <CardContent className="pt-7">
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nama</Label>
        <Input id="name" name="name" required defaultValue={defaultValues?.name} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">No. WhatsApp</Label>
        <Input id="phone" name="phone" required placeholder="628123456789" defaultValue={defaultValues?.phone} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email (opsional)</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="branchId">Cabang</Label>
        <Select name="branchId" defaultValue={defaultValues?.branchId ?? undefined}>
          <SelectTrigger id="branchId">
            <SelectValue placeholder="Pilih cabang" />
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
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={defaultValues?.status ?? 'NEW'}>
          <SelectTrigger id="status">
            <SelectValue />
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
      <div className="space-y-1.5">
        <Label htmlFor="source">Sumber (opsional)</Label>
        <Input id="source" name="source" placeholder="Instagram, referral, dll." defaultValue={defaultValues?.source ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Catatan</Label>
        <Textarea id="notes" name="notes" defaultValue={defaultValues?.notes ?? ''} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </form>
      </CardContent>
    </Card>
  );
}
