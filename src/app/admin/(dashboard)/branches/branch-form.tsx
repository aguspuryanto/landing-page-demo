'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BranchFormState } from './actions';

type Region = { id: string; name: string };

type Props = {
  action: (state: BranchFormState, formData: FormData) => Promise<BranchFormState>;
  regions: Region[];
  defaultValues?: {
    name: string;
    slug: string;
    regionId: string;
    address: string | null;
    phone: string | null;
    city: string | null;
    mapEmbed: string | null;
  };
};

export function BranchForm({ action, regions, defaultValues }: Props) {
  const [state, formAction, pending] = useActionState<BranchFormState, FormData>(action, undefined);

  return (
    <Card className="max-w-xl">
      <CardContent className="pt-7">
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nama Cabang</Label>
        <Input id="name" name="name" required defaultValue={defaultValues?.name} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug (dipakai di URL landing page)</Label>
        <Input id="slug" name="slug" required placeholder="cabang-surabaya" defaultValue={defaultValues?.slug} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="regionId">Region</Label>
        <Select name="regionId" defaultValue={defaultValues?.regionId}>
          <SelectTrigger id="regionId">
            <SelectValue placeholder="Pilih region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="city">Kota</Label>
        <Input id="city" name="city" defaultValue={defaultValues?.city ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Alamat</Label>
        <Textarea id="address" name="address" defaultValue={defaultValues?.address ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Telepon</Label>
        <Input id="phone" name="phone" defaultValue={defaultValues?.phone ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="mapEmbed">Embed Google Maps (opsional)</Label>
        <Textarea id="mapEmbed" name="mapEmbed" defaultValue={defaultValues?.mapEmbed ?? ''} />
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
