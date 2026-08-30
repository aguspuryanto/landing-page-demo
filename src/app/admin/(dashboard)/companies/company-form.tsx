'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CompanyFormState } from './actions';

type Props = {
  action: (state: CompanyFormState, formData: FormData) => Promise<CompanyFormState>;
  defaultValues?: { name: string; code: string };
};

export function CompanyForm({ action, defaultValues }: Props) {
  const [state, formAction, pending] = useActionState<CompanyFormState, FormData>(action, undefined);

  return (
    <Card className="max-w-xl">
      <CardContent className="pt-7">
        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Company</Label>
            <Input id="name" name="name" required defaultValue={defaultValues?.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="code">Kode</Label>
            <Input id="code" name="code" required placeholder="AFG" defaultValue={defaultValues?.code} />
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
