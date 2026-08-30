'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/auth/session';
import { LoginSchema } from '@/lib/validation';

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { error: 'Email atau password tidak valid.' };
  }

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
    },
  });
  if (!user) {
    return { error: 'Email atau password salah.' };
  }

  if (!user.isActive) {
    return { error: 'Akun ini dinonaktifkan. Hubungi administrator.' };
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return { error: 'Email atau password salah.' };
  }

  await createSession(user);
  redirect('/admin/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login');
}
