import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

/**
 * In-memory stand-in for the PostgreSQL database, used while no DATABASE_URL
 * is configured. Data lives only in server process memory and resets on
 * restart. Implements only the exact query shapes used elsewhere in the app
 * (see src/lib/db.ts) — not a generic ORM.
 */

export type Role = 'ADMIN' | 'STAFF';
export type CustomerStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type BroadcastType = 'WHATSAPP' | 'EMAIL';
export type CampaignStatus = 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED';
export type LogStatus = 'PENDING' | 'SENT' | 'FAILED';

export type DummyUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
};

export type DummyBranch = {
  id: string;
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
  users: [] as DummyUser[],
  branches: [] as DummyBranch[],
  customers: [] as DummyCustomer[],
  landingPages: [] as DummyLandingPage[],
  campaigns: [] as DummyBroadcastCampaign[],
  logs: [] as DummyBroadcastLog[],
};

function seed() {
  if (db.branches.length > 0) return;

  const seededEmail = process.env.SEED_ADMIN_EMAIL || 'admin@demo.test';
  const seededName = process.env.SEED_ADMIN_NAME || 'Admin Demo';
  const seededPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  db.users.push({
    id: 'seed-admin',
    name: seededName,
    email: seededEmail,
    password: bcrypt.hashSync(seededPassword, 10),
    role: 'ADMIN',
    createdAt: now,
  });

  const branchSukomanunggal: DummyBranch = {
    id: 'seed-branch-sukomanunggal',
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

  for (const [name, phone, branch, status] of customerSeeds) {
    db.customers.push({
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
    });
  }
}

seed();
