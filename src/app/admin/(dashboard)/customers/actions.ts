'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth/dal';
import { CustomerSchema } from '@/lib/validation';

export type CustomerFormState = { error?: string } | undefined;

function parseCustomerForm(formData: FormData) {
  return CustomerSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    source: formData.get('source'),
    branchId: formData.get('branchId'),
  });
}

export async function createCustomer(
  _prevState: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  await verifySession();

  const validated = parseCustomerForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const { branchId, email, notes, source, ...rest } = validated.data;
  await prisma.customer.create({
    data: {
      ...rest,
      email: email || null,
      notes: notes || null,
      source: source || null,
      branchId: branchId || null,
    },
  });

  revalidatePath('/admin/customers');
  redirect('/admin/customers');
}

export async function updateCustomer(
  id: string,
  _prevState: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  await verifySession();

  const validated = parseCustomerForm(formData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const { branchId, email, notes, source, ...rest } = validated.data;
  await prisma.customer.update({
    where: { id },
    data: {
      ...rest,
      email: email || null,
      notes: notes || null,
      source: source || null,
      branchId: branchId || null,
    },
  });

  revalidatePath('/admin/customers');
  redirect('/admin/customers');
}

export async function deleteCustomer(id: string) {
  await verifySession();
  await prisma.customer.delete({ where: { id } });
  revalidatePath('/admin/customers');
}
