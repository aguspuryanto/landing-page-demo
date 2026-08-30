import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const name = process.env.SEED_ADMIN_NAME ?? 'Admin';
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@local.test';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'changeme123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User admin dengan email ${email} sudah ada, dilewati.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'ADMIN' },
  });

  console.log(`User ADMIN dibuat: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
