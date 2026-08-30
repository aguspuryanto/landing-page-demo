'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserFormState } from './actions';

type Option = { id: string; name: string };

type Props = {
  action: (state: UserFormState, formData: FormData) => Promise<UserFormState>;
  roles: Option[];
  regions: Option[];
  branches: Option[];
  isEdit?: boolean;
  defaultValues?: {
    name: string;
    email: string;
    roleId: string;
    regionId: string | null;
    branchId: string | null;
    isActive: boolean;
  };
};

export function UserForm({ action, roles, regions, branches, isEdit, defaultValues }: Props) {
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(action, undefined);

  return (
    <Card className="max-w-xl">
      <CardContent className="pt-7">
        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" name="name" required defaultValue={defaultValues?.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required defaultValue={defaultValues?.email} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password {isEdit && <span className="text-muted-foreground">(kosongkan jika tidak diubah)</span>}</Label>
            <Input id="password" name="password" type="password" required={!isEdit} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="roleId">Role</Label>
            <Select name="roleId" defaultValue={defaultValues?.roleId}>
              <SelectTrigger id="roleId">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="regionId">Region (opsional)</Label>
            <Select name="regionId" defaultValue={defaultValues?.regionId ?? undefined}>
              <SelectTrigger id="regionId">
                <SelectValue placeholder="Tanpa region" />
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
            <Label htmlFor="branchId">Cabang (opsional)</Label>
            <Select name="branchId" defaultValue={defaultValues?.branchId ?? undefined}>
              <SelectTrigger id="branchId">
                <SelectValue placeholder="Tanpa cabang" />
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
          <div className="flex items-center gap-2">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              defaultChecked={defaultValues?.isActive ?? true}
            />
            <Label htmlFor="isActive">Akun aktif</Label>
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
