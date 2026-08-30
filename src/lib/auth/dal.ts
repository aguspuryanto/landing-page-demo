import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { decrypt, getSessionCookie, type SessionPayload } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const cookie = await getSessionCookie();
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect('/admin/login');
  }

  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await verifySession();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      companyId: true,
      regionId: true,
      branchId: true,
      role: { select: { id: true, name: true } },
    },
  });

  if (!user) {
    // proxy.ts already verifies the user still exists and clears stale
    // cookies before a request reaches here, so this should be unreachable —
    // kept as a safety net. Cookies can't be mutated during a render, only
    // in a Server Action/Route Handler/proxy, so just redirect here.
    redirect('/admin/login');
  }

  return user;
});
