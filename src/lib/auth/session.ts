import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export type SessionPayload = {
  userId: string;
  companyId: string;
  regionId: string | null;
  branchId: string | null;
  roleId: string;
  roleName: string;
  permissions: string[];
  expiresAt: number;
};

export type SessionUser = {
  id: string;
  companyId: string;
  regionId: string | null;
  branchId: string | null;
  role: {
    id: string;
    name: string;
    permissions: Array<{ permission: { key: string } }>;
  };
};

let secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  console.warn('[session] SESSION_SECRET tidak diset — memakai secret dev sementara (jangan pakai di production).');
  secretKey = 'dev-only-insecure-session-secret-do-not-use-in-production';
}
const encodedKey = new TextEncoder().encode(secretKey);

const SESSION_COOKIE = 'session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({
    userId: user.id,
    companyId: user.companyId,
    regionId: user.regionId,
    branchId: user.branchId,
    roleId: user.role.id,
    roleName: user.role.name,
    permissions: user.role.permissions.map((p) => p.permission.key),
    expiresAt: expiresAt.getTime(),
  });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}
