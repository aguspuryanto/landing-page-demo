import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

const LOGIN_PATH = '/admin/login';
const SESSION_COOKIE = 'session';

/**
 * Resolves the session cookie to a still-existing user. Doing a DB lookup
 * here (instead of only checking the JWT signature) is a deliberate
 * trade-off: without it, a cookie that outlives its user (e.g. the in-memory
 * dummy dataset resetting on a dev server restart, or an account being
 * deleted) leaves proxy and the dashboard layout disagreeing about whether
 * the session is valid, which causes a redirect loop. The dummy store is an
 * in-memory lookup and the real store is a single indexed query, so the
 * cost is small for an internal CRM's traffic.
 */
async function getValidSession(request: NextRequest) {
  const session = await decrypt(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true } });
  return user ? session : null;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getValidSession(request);

  if (pathname === LOGIN_PATH) {
    if (session) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (!session) {
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
