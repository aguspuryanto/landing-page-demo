'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { BranchSchema } from '@/lib/validation';

export type BranchFormState = { error?: string } | undefined;

function parseBranchForm(formData: FormData) {
  return BranchSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    regionId: formData.get('regionId'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    mapEmbed: formData.get('mapEmbed'),
  });
}

export async function createBranch(_prevState: BranchFormState, formData: FormData): Promise<BranchFormState> {
  const session = await verifySession();

  const validated = parseBranchForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const existing = await prisma.branch.findUnique({ where: { slug: validated.data.slug } });
  if (existing) {
    return { error: 'Slug sudah dipakai cabang lain.' };
  }

  await prisma.branch.create({ data: { ...validated.data, companyId: session.companyId } });
  revalidatePath('/admin/branches');
  redirect('/admin/branches');
}

export async function updateBranch(
  id: string,
  _prevState: BranchFormState,
  formData: FormData
): Promise<BranchFormState> {
  await verifySession();

  const validated = parseBranchForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const existing = await prisma.branch.findFirst({
    where: { slug: validated.data.slug, NOT: { id } },
  });
  if (existing) {
    return { error: 'Slug sudah dipakai cabang lain.' };
  }

  await prisma.branch.update({ where: { id }, data: validated.data });
  revalidatePath('/admin/branches');
  redirect('/admin/branches');
}

export async function deleteBranch(id: string) {
  await verifySession();
  await prisma.branch.delete({ where: { id } });
  revalidatePath('/admin/branches');
}
