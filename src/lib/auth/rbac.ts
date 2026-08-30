import 'server-only';
import { redirect } from 'next/navigation';
import type { SessionPayload } from '@/lib/auth/session';
import type { PermissionKey } from '@/lib/rbac-constants';

export type AccessScope =
  | { level: 'ALL' }
  | { level: 'REGION'; regionId: string }
  | { level: 'BRANCH'; branchId: string };

export function can(session: SessionPayload, permissionKey: PermissionKey): boolean {
  // Defensive fallback: proxy.ts already invalidates a session whose cookie
  // predates the `permissions` field, but any code path that reads a
  // session without going through proxy first (e.g. a stale cached value)
  // should fail closed instead of throwing.
  return Array.isArray(session.permissions) && session.permissions.includes(permissionKey);
}

/**
 * Derives what data a session can see. Every future domain query (Phase 2+:
 * leads, applications, contracts, ...) should filter through this instead of
 * re-deriving scope ad hoc, so "jangan hardcode branch/role" holds as the
 * system grows.
 */
export function getAccessScope(session: SessionPayload): AccessScope {
  if (can(session, 'data.scope.all')) return { level: 'ALL' };
  if (can(session, 'data.scope.region') && session.regionId) return { level: 'REGION', regionId: session.regionId };
  if (session.branchId) return { level: 'BRANCH', branchId: session.branchId };
  return { level: 'ALL' };
}

/**
 * Guard for the start of every Administration Server Action/page. Next's
 * forbidden() would be the natural 403 primitive here, but it's still
 * experimental (requires next.config's `experimental.authInterrupts`) — to
 * avoid pulling in an experimental API for foundational auth code, this just
 * redirects back to the dashboard when the session lacks the permission.
 * Call after verifySession() so an unauthenticated request has already been
 * redirected to /admin/login.
 */
export function requirePermission(session: SessionPayload, permissionKey: PermissionKey) {
  if (!can(session, permissionKey)) {
    redirect('/admin/dashboard');
  }
}
