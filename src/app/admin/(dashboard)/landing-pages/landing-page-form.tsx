'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { LandingPageFormState } from './actions';

type Props = {
  action: (state: LandingPageFormState, formData: FormData) => Promise<LandingPageFormState>;
  defaultValues?: {
    heroTitle: string;
    heroSubtitle: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    ogImage: string | null;
    published: boolean;
  };
};

export function LandingPageForm({ action, defaultValues }: Props) {
  const [state, formAction, pending] = useActionState<LandingPageFormState, FormData>(action, undefined);

  return (
    <Card className="max-w-xl">
      <CardContent className="pt-7">
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="heroTitle">Judul Hero</Label>
        <Input id="heroTitle" name="heroTitle" required defaultValue={defaultValues?.heroTitle} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="heroSubtitle">Subjudul Hero</Label>
        <Textarea id="heroSubtitle" name="heroSubtitle" defaultValue={defaultValues?.heroSubtitle ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ogImage">URL Gambar (hero / OG image)</Label>
        <Input id="ogImage" name="ogImage" placeholder="https://..." defaultValue={defaultValues?.ogImage ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="seoTitle">SEO Title</Label>
        <Input id="seoTitle" name="seoTitle" defaultValue={defaultValues?.seoTitle ?? ''} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="seoDescription">SEO Description</Label>
        <Textarea id="seoDescription" name="seoDescription" defaultValue={defaultValues?.seoDescription ?? ''} />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          className="h-4 w-4 rounded border-input"
          defaultChecked={defaultValues?.published ?? false}
        />
        <Label htmlFor="published">Publikasikan halaman ini</Label>
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
