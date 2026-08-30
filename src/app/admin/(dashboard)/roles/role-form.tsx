'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RoleFormState } from './actions';

type Permission = { id: string; key: string; module: string; description: string | null };

type Props = {
  action: (state: RoleFormState, formData: FormData) => Promise<RoleFormState>;
  permissions: Permission[];
  defaultValues?: { name: string; permissionIds: string[]; isSystem: boolean };
};

export function RoleForm({ action, permissions, defaultValues }: Props) {
  const [state, formAction, pending] = useActionState<RoleFormState, FormData>(action, undefined);
  const checkedIds = new Set(defaultValues?.permissionIds ?? []);

  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    (acc[perm.module] ??= []).push(perm);
    return acc;
  }, {});

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-7">
        <form action={formAction} className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Role</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="CUSTOM_ROLE"
              defaultValue={defaultValues?.name}
              readOnly={defaultValues?.isSystem}
              className={defaultValues?.isSystem ? 'bg-muted' : undefined}
            />
            {defaultValues?.isSystem && (
              <p className="text-xs text-muted-foreground">
                Role sistem — nama tidak bisa diubah, tapi permission-nya bisa disesuaikan.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Permission</Label>
            {Object.entries(grouped).map(([module, perms]) => (
              <div key={module} className="rounded-lg border border-border p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{module}</p>
                <div className="space-y-2.5">
                  {perms.map((perm) => (
                    <label key={perm.id} className="flex items-start gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        name="permissionIds"
                        value={perm.id}
                        defaultChecked={checkedIds.has(perm.id)}
                        className="mt-0.5 h-4 w-4 rounded border-input"
                      />
                      <span>
                        <span className="font-medium text-foreground">{perm.key}</span>
                        {perm.description && <span className="block text-muted-foreground">{perm.description}</span>}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
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
