import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { dummyPrisma } from '@/lib/dummy-prisma';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const USE_DUMMY_DB = !process.env.DATABASE_URL;

if (USE_DUMMY_DB && process.env.NODE_ENV !== 'production') {
  console.warn(
    '[db] DATABASE_URL tidak diset — menggunakan data dummy in-memory (reset setiap restart server).'
  );
}

function createRealPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = USE_DUMMY_DB
  ? (dummyPrisma as unknown as PrismaClient)
  : globalForPrisma.prisma ?? createRealPrismaClient();

if (!USE_DUMMY_DB && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
