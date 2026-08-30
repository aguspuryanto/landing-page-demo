import { randomUUID } from 'crypto';
import {
  db,
  type CustomerStatus,
  type DummyBranch,
  type DummyCustomer,
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

function customerWithBranch(customer: DummyCustomer) {
  const branch = customer.branchId ? db.branches.find((b) => b.id === customer.branchId) : null;
  return { ...clone(customer), branch: branch ? { name: branch.name } : null };
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

export const dummyPrisma = {
  user: {
    async findUnique({ where, select }: { where: { id?: string; email?: string }; select?: Record<string, boolean> }) {
      const user = db.users.find((u) => (where.id ? u.id === where.id : u.email === where.email));
      if (!user) return null;
      if (!select) return clone(user);
      const picked: Record<string, unknown> = {};
      for (const key of Object.keys(select)) {
        if (select[key]) picked[key] = (user as unknown as Record<string, unknown>)[key];
      }
      return picked;
    },
  },

  branch: {
    async count() {
      return db.branches.length;
    },
    async findMany(args?: {
      select?: { id: boolean; name: boolean };
      include?: { _count?: unknown; landingPage?: unknown };
      orderBy?: { name?: 'asc' | 'desc'; createdAt?: 'asc' | 'desc' };
    }) {
      let items = [...db.branches];
      if (args?.orderBy?.name) items = sortBy(items, 'name', args.orderBy.name);
      if (args?.orderBy?.createdAt) items = sortBy(items, 'createdAt', args.orderBy.createdAt);

      if (args?.select) {
        return items.map((b) => ({ id: b.id, name: b.name }));
      }
      if (args?.include?.landingPage) {
        return items.map(branchWithLandingPage);
      }
      if (args?.include?._count) {
        return items.map(branchWithCount);
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
};
