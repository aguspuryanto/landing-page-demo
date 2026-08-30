import 'server-only';
import { prisma } from '@/lib/db';

type WriteAuditLogInput = {
  userId: string;
  action: string;
  module: string;
  recordId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
};

/**
 * Records a sensitive mutation (create/update/delete in the Administration
 * module: Company/Region/Branch/Role/User). No delete action is exposed
 * anywhere in the UI for AuditLog itself, per the rule that audit trails
 * must not be erasable by ordinary users.
 */
export async function writeAuditLog({ userId, action, module, recordId, oldValue, newValue }: WriteAuditLogInput) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      module,
      recordId: recordId ?? null,
      oldValue: oldValue ?? undefined,
      newValue: newValue ?? undefined,
    },
  });
}
