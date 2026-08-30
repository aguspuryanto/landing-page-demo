'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RegionFormState } from './actions';

type Company = { id: string; name: string };

type Props = {
  action: (state: RegionFormState, formData: FormData) => Promise<RegionFormState>;
  companies: Company[];
  defaultValues?: { name: string; code: string; companyId: string };
};

export function RegionForm({ action, companies, defaultValues }: Props) {
  const [state, formAction, pending] = useActionState<RegionFormState, FormData>(action, undefined);

  return (
    <Card className="max-w-xl">
      <CardContent className="pt-7">
        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Region</Label>
            <Input id="name" name="name" required defaultValue={defaultValues?.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="code">Kode</Label>
            <Input id="code" name="code" required placeholder="JATIM" defaultValue={defaultValues?.code} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyId">Company</Label>
            <Select name="companyId" defaultValue={defaultValues?.companyId}>
              <SelectTrigger id="companyId">
                <SelectValue placeholder="Pilih company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
