import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PERMISSIONS, SYSTEM_ROLES } from '@/lib/rbac-constants';

/**
 * In-memory stand-in for the PostgreSQL database, used while no DATABASE_URL
 * is configured. Data lives only in server process memory and resets on
 * restart. Implements only the exact query shapes used elsewhere in the app
 * (see src/lib/db.ts) — not a generic ORM.
 */

export type CustomerStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
export type BroadcastType = 'WHATSAPP' | 'EMAIL';
export type CampaignStatus = 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED';
export type LogStatus = 'PENDING' | 'SENT' | 'FAILED';

export type DummyCompany = {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
};

export type DummyRegion = {
  id: string;
  companyId: string;
  name: string;
  code: string;
  createdAt: Date;
};

export type DummyPermission = {
  id: string;
  key: string;
  module: string;
  description: string | null;
};

export type DummyRole = {
  id: string;
  companyId: string | null;
  name: string;
  isSystem: boolean;
  createdAt: Date;
};

export type DummyRolePermission = {
  roleId: string;
  permissionId: string;
};

export type DummyAuditLog = {
  id: string;
  userId: string;
  action: string;
  module: string;
  recordId: string | null;
  oldValue: unknown;
  newValue: unknown;
  ip: string | null;
  createdAt: Date;
};

export type DummyUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  companyId: string;
  regionId: string | null;
  branchId: string | null;
  roleId: string;
  isActive: boolean;
  createdAt: Date;
};

export type DummyBranch = {
  id: string;
  companyId: string;
  regionId: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  city: string | null;
  mapEmbed: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type DummyCustomer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: CustomerStatus;
  notes: string | null;
  source: string | null;
  branchId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type DummyLandingPage = {
  id: string;
  branchId: string;
  heroTitle: string;
  heroSubtitle: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  content: unknown;
  published: boolean;
  updatedAt: Date;
};

export type DummyBroadcastCampaign = {
  id: string;
  type: BroadcastType;
  subject: string | null;
  message: string;
  filterBranchId: string | null;
  filterStatus: CustomerStatus | null;
  status: CampaignStatus;
  createdById: string;
  createdAt: Date;
};

export type DummyLoan = {
  id: string;
  customerId: string;
  branchId: string | null;
  amount: number;
  status: LoanStatus;
  approvedAt: Date | null;
  createdAt: Date;
};

export type DummyBroadcastLog = {
  id: string;
  campaignId: string;
  customerId: string;
  status: LogStatus;
  error: string | null;
  sentAt: Date | null;
};

const now = new Date();

export const db = {
  companies: [] as DummyCompany[],
  regions: [] as DummyRegion[],
  permissions: [] as DummyPermission[],
  roles: [] as DummyRole[],
  rolePermissions: [] as DummyRolePermission[],
  auditLogs: [] as DummyAuditLog[],
  users: [] as DummyUser[],
  branches: [] as DummyBranch[],
  customers: [] as DummyCustomer[],
  loans: [] as DummyLoan[],
  landingPages: [] as DummyLandingPage[],
  campaigns: [] as DummyBroadcastCampaign[],
  logs: [] as DummyBroadcastLog[],
};

function permissionId(key: string) {
  return `perm-${key}`;
}

function roleId(name: string) {
  return `role-${name.toLowerCase()}`;
}

function seed() {
  if (db.companies.length > 0) return;

  const company: DummyCompany = {
    id: 'seed-company',
    name: 'Adira Finance Group',
    code: 'AFG',
    createdAt: now,
  };
  db.companies.push(company);

  const region: DummyRegion = {
    id: 'seed-region-jatim',
    companyId: company.id,
    name: 'Jawa Timur',
    code: 'JATIM',
    createdAt: now,
  };
  db.regions.push(region);

  for (const perm of PERMISSIONS) {
    db.permissions.push({ id: permissionId(perm.key), key: perm.key, module: perm.module, description: perm.description });
  }

  for (const roleDef of SYSTEM_ROLES) {
    const id = roleId(roleDef.name);
    db.roles.push({ id, companyId: null, name: roleDef.name, isSystem: true, createdAt: now });
    for (const key of roleDef.permissions) {
      db.rolePermissions.push({ roleId: id, permissionId: permissionId(key) });
    }
  }

  const seededEmail = process.env.SEED_ADMIN_EMAIL || 'admin@demo.test';
  const seededName = process.env.SEED_ADMIN_NAME || 'Admin Demo';
  const seededPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  db.users.push({
    id: 'seed-admin',
    name: seededName,
    email: seededEmail,
    password: bcrypt.hashSync(seededPassword, 10),
    companyId: company.id,
    regionId: null,
    branchId: null,
    roleId: roleId('SUPER_ADMIN'),
    isActive: true,
    createdAt: now,
  });

  const branchSukomanunggal: DummyBranch = {
    id: 'seed-branch-sukomanunggal',
    companyId: company.id,
    regionId: region.id,
    name: 'Adira Finance Sukomanunggal',
    slug: 'sukomanunggal',
    address: 'Jl. Raya Sukomanunggal No. 1, Surabaya',
    phone: '6281234567890',
    city: 'Surabaya',
    mapEmbed: null,
    createdAt: now,
    updatedAt: now,
  };
  const branchRungkut: DummyBranch = {
    id: 'seed-branch-rungkut',
    companyId: company.id,
    regionId: region.id,
    name: 'Adira Finance Rungkut',
    slug: 'rungkut',
    address: 'Jl. Rungkut Industri No. 10, Surabaya',
    phone: '6281234567891',
    city: 'Surabaya',
    mapEmbed: null,
    createdAt: now,
    updatedAt: now,
  };
  db.branches.push(branchSukomanunggal, branchRungkut);

  db.users.push({
    id: 'seed-branch-manager',
    name: 'Manajer Cabang Rungkut',
    email: 'manager.rungkut@demo.test',
    password: bcrypt.hashSync(seededPassword, 10),
    companyId: company.id,
    regionId: region.id,
    branchId: branchRungkut.id,
    roleId: roleId('BRANCH_MANAGER'),
    isActive: true,
    createdAt: now,
  });

  db.landingPages.push(
    {
      id: randomUUID(),
      branchId: branchSukomanunggal.id,
      heroTitle: 'Gadai BPKB Motor & Mobil Cair Hari Ini',
      heroSubtitle: 'Proses cepat, bunga rendah, dana langsung cair di Adira Finance Sukomanunggal.',
      seoTitle: 'Gadai BPKB Sukomanunggal | Adira Finance',
      seoDescription: 'Layanan gadai BPKB motor & mobil resmi Adira Finance cabang Sukomanunggal, Surabaya.',
      ogImage: null,
      content: null,
      published: true,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      branchId: branchRungkut.id,
      heroTitle: 'Pembiayaan BPKB Terpercaya di Rungkut',
      heroSubtitle: null,
      seoTitle: null,
      seoDescription: null,
      ogImage: null,
      content: null,
      published: false,
      updatedAt: now,
    }
  );

  const customerSeeds: Array<[string, string, DummyBranch, CustomerStatus]> = [
    ['Budi Santoso', '628111111111', branchSukomanunggal, 'NEW'],
    ['Siti Aminah', '628222222222', branchSukomanunggal, 'CONTACTED'],
    ['Agus Wijaya', '628333333333', branchRungkut, 'QUALIFIED'],
    ['Dewi Lestari', '628444444444', branchRungkut, 'CONVERTED'],
  ];

  const customers: DummyCustomer[] = [];
  for (const [name, phone, branch, status] of customerSeeds) {
    const customer: DummyCustomer = {
      id: randomUUID(),
      name,
      phone,
      email: null,
      status,
      notes: null,
      source: 'Demo seed',
      branchId: branch.id,
      createdAt: now,
      updatedAt: now,
    };
    db.customers.push(customer);
    customers.push(customer);
  }

  const [budi, siti, agus, dewi] = customers;
  const loanSeeds: Array<[DummyCustomer, number, LoanStatus]> = [
    [budi, 8_000_000, 'PENDING'],
    [siti, 12_000_000, 'APPROVED'],
    [agus, 25_000_000, 'APPROVED'],
    [dewi, 15_000_000, 'DISBURSED'],
    [dewi, 5_000_000, 'REJECTED'],
  ];

  for (const [customer, amount, status] of loanSeeds) {
    db.loans.push({
      id: randomUUID(),
      customerId: customer.id,
      branchId: customer.branchId,
      amount,
      status,
      approvedAt: status === 'APPROVED' || status === 'DISBURSED' ? now : null,
      createdAt: now,
    });
  }
}

seed();
