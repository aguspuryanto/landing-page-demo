import { randomUUID } from 'crypto';
import {
  db,
  type CustomerStatus,
  type DummyBranch,
  type DummyCompany,
  type DummyCustomer,
  type DummyRegion,
  type DummyRole,
  type DummyUser,
  type LoanStatus,
} from '@/lib/dummy-data';

function clone<T>(value: T): T {
  return value === null || value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function sortBy<T>(items: T[], key: keyof T, direction: 'asc' | 'desc') {
  const sorted = [...items].sort((a, b) => {
    const av = a[key] as unknown as string | number | Date;
    const bv = b[key] as unknown as string | number | Date;
    if (av < bv) return direction === 'asc' ? -1 : 1;
    if (av > bv) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}

function branchWithCount(branch: DummyBranch) {
  return {
    ...clone(branch),
    _count: { customers: db.customers.filter((c) => c.branchId === branch.id).length },
  };
}

function branchWithLandingPage(branch: DummyBranch) {
  const landingPage = db.landingPages.find((lp) => lp.branchId === branch.id) ?? null;
  return { ...clone(branch), landingPage: clone(landingPage) };
}

function branchWithRegion(branch: DummyBranch) {
  const region = db.regions.find((r) => r.id === branch.regionId) ?? null;
  return { ...clone(branch), region: region ? { name: region.name } : null };
}

function customerWithBranch(customer: DummyCustomer) {
  const branch = customer.branchId ? db.branches.find((b) => b.id === customer.branchId) : null;
  return { ...clone(customer), branch: branch ? { name: branch.name } : null };
}

function matchesLoanStatus(status: LoanStatus, filter?: LoanStatus | { in: LoanStatus[] }) {
  if (!filter) return true;
  if (typeof filter === 'string') return status === filter;
  return filter.in.includes(status);
}

function matchesCustomerFilter(
  customer: DummyCustomer,
  where?: { branchId?: string; status?: CustomerStatus; email?: { not: null } }
) {
  if (!where) return true;
  if (where.branchId && customer.branchId !== where.branchId) return false;
  if (where.status && customer.status !== where.status) return false;
  if (where.email?.not === null && !customer.email) return false;
  return true;
}

function roleWithPermissions(role: DummyRole) {
  const permissions = db.rolePermissions
    .filter((rp) => rp.roleId === role.id)
    .map((rp) => {
      const permission = db.permissions.find((p) => p.id === rp.permissionId)!;
      return { roleId: rp.roleId, permissionId: rp.permissionId, permission: clone(permission) };
    });
  return { ...clone(role), permissions };
}

function roleWithUserCount(role: DummyRole) {
  return { ...roleWithPermissions(role), _count: { users: db.users.filter((u) => u.roleId === role.id).length } };
}

type UserRelationOpt = boolean | { select?: Record<string, boolean>; include?: Record<string, boolean> };

function resolveUserRelations(user: DummyUser, relations: Record<string, UserRelationOpt>) {
  const result: Record<string, unknown> = clone(user);

  if (relations.role) {
    const role = db.roles.find((r) => r.id === user.roleId);
    const opt = relations.role;
    if (typeof opt === 'object' && opt.include?.permissions) {
      result.role = role ? roleWithPermissions(role) : null;
    } else if (typeof opt === 'object' && opt.select) {
      const picked: Record<string, unknown> = {};
      for (const key of Object.keys(opt.select)) {
        if (opt.select[key]) picked[key] = (role as unknown as Record<string, unknown> | undefined)?.[key] ?? null;
      }
      result.role = role ? picked : null;
    } else {
      result.role = role ? clone(role) : null;
    }
  }
  if (relations.company) {
    result.company = clone(db.companies.find((c) => c.id === user.companyId) ?? null);
  }
  if (relations.region) {
    const region = user.regionId ? db.regions.find((r) => r.id === user.regionId) : null;
    result.region = region ? clone(region) : null;
  }
  if (relations.branch) {
    const branch = user.branchId ? db.branches.find((b) => b.id === user.branchId) : null;
    result.branch = branch ? clone(branch) : null;
  }
  return result;
}

export const dummyPrisma = {
  user: {
    async findUnique({
      where,
      select,
      include,
    }: {
      where: { id?: string; email?: string };
      select?: Record<string, boolean | UserRelationOpt> & { role?: UserRelationOpt; company?: UserRelationOpt; region?: UserRelationOpt; branch?: UserRelationOpt };
      include?: Record<string, UserRelationOpt>;
    }) {
      const user = db.users.find((u) => (where.id ? u.id === where.id : u.email === where.email));
      if (!user) return null;

      if (include) {
        return resolveUserRelations(user, include);
      }
      if (select) {
        const relationKeys = ['role', 'company', 'region', 'branch'] as const;
        const relations: Record<string, UserRelationOpt> = {};
        for (const key of relationKeys) {
          if (select[key]) relations[key] = select[key] as UserRelationOpt;
        }
        const resolved = resolveUserRelations(user, relations);
        const picked: Record<string, unknown> = {};
        for (const key of Object.keys(select)) {
          if (select[key]) picked[key] = resolved[key];
        }
        return picked;
      }
      return clone(user);
    },
    async findMany({
      include,
      orderBy,
    }: {
      include?: { role?: UserRelationOpt; branch?: UserRelationOpt; region?: UserRelationOpt };
      orderBy?: { createdAt?: 'asc' | 'desc' };
    } = {}) {
      let items = [...db.users];
      if (orderBy?.createdAt) items = sortBy(items, 'createdAt', orderBy.createdAt);
      return include ? items.map((u) => resolveUserRelations(u, include)) : items.map(clone);
    },
    async create({ data }: { data: Omit<DummyUser, 'id' | 'createdAt'> }) {
      const user: DummyUser = { ...data, id: randomUUID(), createdAt: new Date() };
      db.users.push(user);
      return clone(user);
    },
    async update({ where, data }: { where: { id: string }; data: Partial<DummyUser> }) {
      const user = db.users.find((u) => u.id === where.id);
      if (!user) throw new Error('User not found');
      Object.assign(user, data);
      return clone(user);
    },
    async delete({ where }: { where: { id: string } }) {
      const index = db.users.findIndex((u) => u.id === where.id);
      if (index === -1) throw new Error('User not found');
      const [removed] = db.users.splice(index, 1);
      return clone(removed);
    },
  },

  company: {
    async findMany({
      select,
      orderBy,
    }: { select?: { id: boolean; name: boolean }; orderBy?: { name?: 'asc' | 'desc' } } = {}) {
      let items = [...db.companies];
      if (orderBy?.name) items = sortBy(items, 'name', orderBy.name);
      if (select) return items.map((c) => ({ id: c.id, name: c.name }));
      return items.map(clone);
    },
    async findUnique({ where }: { where: { id: string } }) {
      const company = db.companies.find((c) => c.id === where.id);
      return company ? clone(company) : null;
    },
    async findFirst({ where }: { where: { code: string; NOT?: { id: string } } }) {
      const company = db.companies.find((c) => c.code === where.code && (!where.NOT || c.id !== where.NOT.id));
      return company ? clone(company) : null;
    },
    async create({ data }: { data: Omit<DummyCompany, 'id' | 'createdAt'> }) {
      const company: DummyCompany = { ...data, id: randomUUID(), createdAt: new Date() };
      db.companies.push(company);
      return clone(company);
    },
    async update({ where, data }: { where: { id: string }; data: Partial<DummyCompany> }) {
      const company = db.companies.find((c) => c.id === where.id);
      if (!company) throw new Error('Company not found');
      Object.assign(company, data);
      return clone(company);
    },
    async delete({ where }: { where: { id: string } }) {
      const index = db.companies.findIndex((c) => c.id === where.id);
      if (index === -1) throw new Error('Company not found');
      const [removed] = db.companies.splice(index, 1);
      return clone(removed);
    },
  },

  region: {
    async findMany({
      select,
      include,
      orderBy,
    }: {
      select?: { id: boolean; name: boolean };
      include?: { company?: unknown };
      orderBy?: { name?: 'asc' | 'desc' };
    } = {}) {
      let items = [...db.regions];
      if (orderBy?.name) items = sortBy(items, 'name', orderBy.name);
      if (select) return items.map((r) => ({ id: r.id, name: r.name }));
      if (include?.company) {
        return items.map((r) => {
          const company = db.companies.find((c) => c.id === r.companyId);
          return { ...clone(r), company: company ? { name: company.name } : null };
        });
      }
      return items.map(clone);
    },
    async findUnique({ where }: { where: { id: string } }) {
      const region = db.regions.find((r) => r.id === where.id);
      return region ? clone(region) : null;
    },
    async findFirst({ where }: { where: { companyId: string; code: string; NOT?: { id: string } } }) {
      const region = db.regions.find(
        (r) => r.companyId === where.companyId && r.code === where.code && (!where.NOT || r.id !== where.NOT.id)
      );
      return region ? clone(region) : null;
    },
    async create({ data }: { data: Omit<DummyRegion, 'id' | 'createdAt'> }) {
      const region: DummyRegion = { ...data, id: randomUUID(), createdAt: new Date() };
      db.regions.push(region);
      return clone(region);
    },
    async update({ where, data }: { where: { id: string }; data: Partial<DummyRegion> }) {
      const region = db.regions.find((r) => r.id === where.id);
      if (!region) throw new Error('Region not found');
      Object.assign(region, data);
      return clone(region);
    },
    async delete({ where }: { where: { id: string } }) {
      const index = db.regions.findIndex((r) => r.id === where.id);
      if (index === -1) throw new Error('Region not found');
      const [removed] = db.regions.splice(index, 1);
      return clone(removed);
    },
  },

  permission: {
    async findMany({ orderBy }: { orderBy?: { module?: 'asc' | 'desc' } } = {}) {
      let items = [...db.permissions];
      if (orderBy?.module) items = sortBy(items, 'module', orderBy.module);
      return items.map(clone);
    },
  },

  role: {
    async findMany({
      select,
      include,
      orderBy,
    }: {
      select?: { id: boolean; name: boolean };
      include?: { permissions?: unknown; _count?: unknown };
      orderBy?: { name?: 'asc' | 'desc' };
    } = {}) {
      let items = [...db.roles];
      if (orderBy?.name) items = sortBy(items, 'name', orderBy.name);
      if (select) return items.map((r) => ({ id: r.id, name: r.name }));
      if (include?._count) return items.map(roleWithUserCount);
      if (include?.permissions) return items.map(roleWithPermissions);
      return items.map(clone);
    },
    async findUnique({ where, include }: { where: { id: string }; include?: { permissions?: unknown } }) {
      const role = db.roles.find((r) => r.id === where.id);
      if (!role) return null;
      return include?.permissions ? roleWithPermissions(role) : clone(role);
    },
    async create({
      data,
    }: {
      data: {
        name: string;
        companyId: string | null;
        isSystem?: boolean;
        permissions?: { create: Array<{ permissionId: string }> };
      };
    }) {
      const role: DummyRole = {
        id: randomUUID(),
        name: data.name,
        companyId: data.companyId,
        isSystem: data.isSystem ?? false,
        createdAt: new Date(),
      };
      db.roles.push(role);
      for (const entry of data.permissions?.create ?? []) {
        db.rolePermissions.push({ roleId: role.id, permissionId: entry.permissionId });
      }
      return roleWithPermissions(role);
    },
    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: {
        name?: string;
        permissions?: { deleteMany?: unknown; create?: Array<{ permissionId: string }> };
      };
    }) {
      const role = db.roles.find((r) => r.id === where.id);
      if (!role) throw new Error('Role not found');
      if (data.name) role.name = data.name;
      if (data.permissions?.deleteMany !== undefined) {
        db.rolePermissions = db.rolePermissions.filter((rp) => rp.roleId !== role.id);
      }
      for (const entry of data.permissions?.create ?? []) {
        db.rolePermissions.push({ roleId: role.id, permissionId: entry.permissionId });
      }
      return roleWithPermissions(role);
    },
    async delete({ where }: { where: { id: string } }) {
      const index = db.roles.findIndex((r) => r.id === where.id);
      if (index === -1) throw new Error('Role not found');
      const [removed] = db.roles.splice(index, 1);
      db.rolePermissions = db.rolePermissions.filter((rp) => rp.roleId !== where.id);
      return clone(removed);
    },
  },

  branch: {
    async count() {
      return db.branches.length;
    },
    async findMany(args?: {
      select?: { id: boolean; name: boolean };
      include?: { _count?: unknown; landingPage?: unknown; region?: unknown };
      orderBy?: { name?: 'asc' | 'desc'; createdAt?: 'asc' | 'desc' };
    }) {
      let items = [...db.branches];
      if (args?.orderBy?.name) items = sortBy(items, 'name', args.orderBy.name);
      if (args?.orderBy?.createdAt) items = sortBy(items, 'createdAt', args.orderBy.createdAt);

      if (args?.select) {
        return items.map((b) => ({ id: b.id, name: b.name }));
      }
      if (args?.include) {
        const { landingPage, region, _count } = args.include;
        return items.map((b) => {
          let result: Record<string, unknown> = clone(b);
          if (landingPage) result = branchWithLandingPage(b);
          if (region) result = { ...result, ...branchWithRegion(b) };
          if (_count) result = { ...result, ...branchWithCount(b) };
          return result;
        });
      }
      return items.map(clone);
    },
    async findUnique({ where, include }: { where: { id?: string; slug?: string }; include?: { landingPage?: boolean } }) {
      const branch = db.branches.find((b) => (where.id ? b.id === where.id : b.slug === where.slug));
      if (!branch) return null;
      return include?.landingPage ? branchWithLandingPage(branch) : clone(branch);
    },
    async findFirst({ where }: { where: { slug: string; NOT?: { id: string } } }) {
      const branch = db.branches.find(
        (b) => b.slug === where.slug && (!where.NOT || b.id !== where.NOT.id)
      );
      return branch ? clone(branch) : null;
    },
    async create({ data }: { data: Omit<DummyBranch, 'id' | 'createdAt' | 'updatedAt'> }) {
      const branch: DummyBranch = { ...data, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
      db.branches.push(branch);
      return clone(branch);
    },
    async update({ where, data }: { where: { id: string }; data: Partial<DummyBranch> }) {
      const branch = db.branches.find((b) => b.id === where.id);
      if (!branch) throw new Error('Branch not found');
      Object.assign(branch, data, { updatedAt: new Date() });
      return clone(branch);
    },
    async delete({ where }: { where: { id: string } }) {
      const index = db.branches.findIndex((b) => b.id === where.id);
      if (index === -1) throw new Error('Branch not found');
      const [removed] = db.branches.splice(index, 1);
      db.landingPages = db.landingPages.filter((lp) => lp.branchId !== where.id);
      return clone(removed);
    },
  },

  customer: {
    async count() {
      return db.customers.length;
    },
    async findMany({
      where,
      include,
      orderBy,
    }: {
      where?: { branchId?: string; status?: CustomerStatus; email?: { not: null } };
      include?: { branch?: unknown };
      orderBy?: { createdAt?: 'asc' | 'desc' };
    } = {}) {
      let items = db.customers.filter((c) => matchesCustomerFilter(c, where));
      if (orderBy?.createdAt) items = sortBy(items, 'createdAt', orderBy.createdAt);
      return include?.branch ? items.map(customerWithBranch) : items.map(clone);
    },
    async findUnique({ where }: { where: { id: string } }) {
      const customer = db.customers.find((c) => c.id === where.id);
      return customer ? clone(customer) : null;
    },
    async create({ data }: { data: Omit<DummyCustomer, 'id' | 'createdAt' | 'updatedAt'> }) {
      const customer: DummyCustomer = { ...data, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
      db.customers.push(customer);
      return clone(customer);
    },
    async update({ where, data }: { where: { id: string }; data: Partial<DummyCustomer> }) {
      const customer = db.customers.find((c) => c.id === where.id);
      if (!customer) throw new Error('Customer not found');
      Object.assign(customer, data, { updatedAt: new Date() });
      return clone(customer);
    },
    async delete({ where }: { where: { id: string } }) {
      const index = db.customers.findIndex((c) => c.id === where.id);
      if (index === -1) throw new Error('Customer not found');
      const [removed] = db.customers.splice(index, 1);
      return clone(removed);
    },
  },

  loan: {
    async count({ where }: { where?: { status?: LoanStatus | { in: LoanStatus[] } } } = {}) {
      return db.loans.filter((l) => matchesLoanStatus(l.status, where?.status)).length;
    },
    async aggregate({
      where,
      _sum,
    }: {
      where?: { status?: LoanStatus | { in: LoanStatus[] } };
      _sum?: { amount?: boolean };
    }) {
      const matching = db.loans.filter((l) => matchesLoanStatus(l.status, where?.status));
      const sum = _sum?.amount ? matching.reduce((total, l) => total + l.amount, 0) : null;
      return { _sum: { amount: sum } };
    },
  },

  landingPage: {
    async upsert({
      where,
      create,
      update,
    }: {
      where: { branchId: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) {
      const existing = db.landingPages.find((lp) => lp.branchId === where.branchId);
      if (existing) {
        Object.assign(existing, update, { updatedAt: new Date() });
        return clone(existing);
      }
      const created = { id: randomUUID(), updatedAt: new Date(), ...create } as (typeof db.landingPages)[number];
      db.landingPages.push(created);
      return clone(created);
    },
  },

  broadcastCampaign: {
    async count() {
      return db.campaigns.length;
    },
    async create({
      data,
      include,
    }: {
      data: {
        type: 'WHATSAPP' | 'EMAIL';
        subject: string | null;
        message: string;
        filterBranchId: string | null;
        filterStatus: CustomerStatus | null;
        status: 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED';
        createdById: string;
        logs: { create: Array<{ customerId: string; status: 'PENDING' }> };
      };
      include?: { logs?: boolean };
    }) {
      const campaign = {
        id: randomUUID(),
        type: data.type,
        subject: data.subject,
        message: data.message,
        filterBranchId: data.filterBranchId,
        filterStatus: data.filterStatus,
        status: data.status,
        createdById: data.createdById,
        createdAt: new Date(),
      };
      db.campaigns.push(campaign);

      const logs = data.logs.create.map((entry) => ({
        id: randomUUID(),
        campaignId: campaign.id,
        customerId: entry.customerId,
        status: entry.status,
        error: null as string | null,
        sentAt: null as Date | null,
      }));
      db.logs.push(...logs);

      return include?.logs ? { ...clone(campaign), logs: clone(logs) } : clone(campaign);
    },
    async update({ where, data }: { where: { id: string }; data: Partial<(typeof db.campaigns)[number]> }) {
      const campaign = db.campaigns.find((c) => c.id === where.id);
      if (!campaign) throw new Error('Campaign not found');
      Object.assign(campaign, data);
      return clone(campaign);
    },
    async findMany({
      orderBy,
      take,
      include,
    }: {
      orderBy?: { createdAt?: 'asc' | 'desc' };
      take?: number;
      include?: { _count?: unknown; createdBy?: unknown };
    }) {
      let items = [...db.campaigns];
      if (orderBy?.createdAt) items = sortBy(items, 'createdAt', orderBy.createdAt);
      if (take) items = items.slice(0, take);

      return items.map((campaign) => {
        const result: Record<string, unknown> = clone(campaign);
        if (include?._count) {
          result._count = { logs: db.logs.filter((l) => l.campaignId === campaign.id).length };
        }
        if (include?.createdBy) {
          const user = db.users.find((u) => u.id === campaign.createdById);
          result.createdBy = { name: user?.name ?? 'Unknown' };
        }
        return result;
      });
    },
  },

  broadcastLog: {
    async count({ where }: { where?: { status?: 'PENDING' | 'SENT' | 'FAILED' } } = {}) {
      if (!where?.status) return db.logs.length;
      return db.logs.filter((l) => l.status === where.status).length;
    },
    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<(typeof db.logs)[number]>;
    }) {
      const log = db.logs.find((l) => l.id === where.id);
      if (!log) throw new Error('Log not found');
      Object.assign(log, data);
      return clone(log);
    },
  },

  auditLog: {
    async create({
      data,
    }: {
      data: {
        userId: string;
        action: string;
        module: string;
        recordId: string | null;
        oldValue?: unknown;
        newValue?: unknown;
        ip?: string | null;
      };
    }) {
      const log = {
        id: randomUUID(),
        userId: data.userId,
        action: data.action,
        module: data.module,
        recordId: data.recordId,
        oldValue: data.oldValue ?? null,
        newValue: data.newValue ?? null,
        ip: data.ip ?? null,
        createdAt: new Date(),
      };
      db.auditLogs.push(log);
      return clone(log);
    },
  },
};
