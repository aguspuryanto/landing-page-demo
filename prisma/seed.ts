import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PERMISSIONS, SYSTEM_ROLES } from '../src/lib/rbac-constants';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const companyName = process.env.SEED_COMPANY_NAME ?? 'Adira Finance Group';
  const companyCode = process.env.SEED_COMPANY_CODE ?? 'AFG';
  const regionName = process.env.SEED_REGION_NAME ?? 'Jawa Timur';
  const regionCode = process.env.SEED_REGION_CODE ?? 'JATIM';

  const company = await prisma.company.upsert({
    where: { code: companyCode },
    update: {},
    create: { name: companyName, code: companyCode },
  });

  const region = await prisma.region.upsert({
    where: { companyId_code: { companyId: company.id, code: regionCode } },
    update: {},
    create: { companyId: company.id, name: regionName, code: regionCode },
  });
  void region;

  const permissionByKey = new Map<string, string>();
  for (const perm of PERMISSIONS) {
    const record = await prisma.permission.upsert({
      where: { key: perm.key },
      update: { module: perm.module, description: perm.description },
      create: perm,
    });
    permissionByKey.set(perm.key, record.id);
  }

  for (const roleDef of SYSTEM_ROLES) {
    const role = await prisma.role.upsert({
      where: { id: `system-role-${roleDef.name}` },
      update: { name: roleDef.name },
      create: { id: `system-role-${roleDef.name}`, name: roleDef.name, companyId: null, isSystem: true },
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: roleDef.permissions.map((key) => ({ roleId: role.id, permissionId: permissionByKey.get(key)! })),
    });
  }

  const name = process.env.SEED_ADMIN_NAME ?? 'Admin';
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@local.test';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'changeme123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User admin dengan email ${email} sudah ada, dilewati.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const superAdminRoleId = `system-role-SUPER_ADMIN`;

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      companyId: company.id,
      roleId: superAdminRoleId,
    },
  });

  console.log(`User SUPER_ADMIN dibuat: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
