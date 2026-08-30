'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { LandingPageSchema } from '@/lib/validation';

export type LandingPageFormState = { error?: string } | undefined;

export async function saveLandingPage(
  branchId: string,
  _prevState: LandingPageFormState,
  formData: FormData
): Promise<LandingPageFormState> {
  await verifySession();

  const validated = LandingPageSchema.safeParse({
    heroTitle: formData.get('heroTitle'),
    heroSubtitle: formData.get('heroSubtitle'),
    seoTitle: formData.get('seoTitle'),
    seoDescription: formData.get('seoDescription'),
    ogImage: formData.get('ogImage'),
    published: formData.get('published') === 'on',
  });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const { heroTitle, heroSubtitle, seoTitle, seoDescription, ogImage, published } = validated.data;
  const data = {
    heroTitle,
    heroSubtitle: heroSubtitle || null,
    seoTitle: seoTitle || null,
    seoDescription: seoDescription || null,
    ogImage: ogImage || null,
    published: published ?? false,
  };

  await prisma.landingPage.upsert({
    where: { branchId },
    create: { branchId, ...data },
    update: data,
  });

  revalidatePath('/admin/landing-pages');
  redirect('/admin/landing-pages');
}
