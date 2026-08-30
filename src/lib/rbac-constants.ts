/**
 * Single source of truth for the Phase 1 (Foundation) RBAC baseline —
 * referenced by prisma/seed.ts, src/lib/dummy-data.ts, and the Roles admin
 * page, so the permission/role catalog never drifts between the real seed
 * and the in-memory dummy seed. New modules add their own permission keys
 * here as later phases are built; roles are re-seeded (not hardcoded in
 * app code) so granting/revoking permissions never requires a code change.
 */

export type PermissionDef = {
  key: string;
  module: string;
  description: string;
};

export const PERMISSIONS: PermissionDef[] = [
  { key: 'platform.manage_companies', module: 'ADMIN', description: 'Kelola seluruh company (super admin)' },
  { key: 'company.manage_regions', module: 'ADMIN', description: 'Kelola region dalam company' },
  { key: 'company.manage_branches', module: 'ADMIN', description: 'Kelola cabang' },
  { key: 'company.manage_users', module: 'ADMIN', description: 'Kelola user' },
  { key: 'company.manage_roles', module: 'ADMIN', description: 'Kelola role & permission' },
  { key: 'data.scope.all', module: 'ADMIN', description: 'Akses data seluruh company' },
  { key: 'data.scope.region', module: 'ADMIN', description: 'Akses data dalam region sendiri' },
  { key: 'data.scope.branch', module: 'ADMIN', description: 'Akses data dalam cabang sendiri' },
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]['key'];

export type SystemRoleDef = {
  name: string;
  permissions: PermissionKey[];
};

export const SYSTEM_ROLES: SystemRoleDef[] = [
  {
    name: 'SUPER_ADMIN',
    permissions: [
      'platform.manage_companies',
      'company.manage_regions',
      'company.manage_branches',
      'company.manage_users',
      'company.manage_roles',
      'data.scope.all',
    ],
  },
  { name: 'HEAD_OFFICE', permissions: ['company.manage_users', 'data.scope.all'] },
  { name: 'REGIONAL_MANAGER', permissions: ['company.manage_users', 'data.scope.region'] },
  { name: 'BRANCH_MANAGER', permissions: ['company.manage_users', 'data.scope.branch'] },
  { name: 'SALES', permissions: ['data.scope.branch'] },
  { name: 'SURVEYOR', permissions: ['data.scope.branch'] },
  { name: 'CREDIT_ANALYST', permissions: ['data.scope.branch'] },
  { name: 'APPROVER', permissions: ['data.scope.branch'] },
  { name: 'COLLECTION', permissions: ['data.scope.branch'] },
  { name: 'FINANCE', permissions: ['data.scope.branch'] },
  { name: 'CUSTOMER_SERVICE', permissions: ['data.scope.branch'] },
];

export const SYSTEM_ROLE_NAMES = SYSTEM_ROLES.map((r) => r.name) as [string, ...string[]];
