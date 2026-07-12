const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Seed failed: DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@madsjeez.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isAdmin: true, passwordHash, isActive: true },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Admin Madsjeez',
      isAdmin: true,
      emailVerified: true,
      subscription: {
        create: {
          plan: 'ENTERPRISE',
          aiRequestsLimit: 10000,
          status: 'ACTIVE',
        },
      },
      browserSettings: { create: {} },
      workspaces: {
        create: [
          {
            name: 'Maqjeez',
            slug: 'maqjeez',
            color: '#FFE600',
            isDefault: true,
            startupUrls: [
              'https://www.mercadolibre.com.ar',
              'https://web.whatsapp.com',
              'https://mail.google.com',
              'https://www.madsjeez.com',
            ],
          },
          {
            name: 'Materia Natural',
            slug: 'materia-natural',
            color: '#10B981',
            startupUrls: [
              'https://www.instagram.com',
              'https://www.facebook.com',
              'https://web.whatsapp.com',
            ],
          },
        ],
      },
    },
  });

  await prisma.appUpdate.upsert({
    where: { version: '0.1.0' },
    update: {
      title: 'Madsjeez Seller Browser MVP',
      description:
        'Initial release with browser, workspaces, AI sidebar, and product management.',
      downloadUrl: 'https://files.catbox.moe/duyrzt.zip',
      checksum: 'sha256:eef08900cb340a09acb668244d513aff1784458a1a8c12d15e60f73afe203d9b',
      fileSize: BigInt(144720011),
      channel: 'STABLE',
    },
    create: {
      version: '0.1.0',
      title: 'Madsjeez Seller Browser MVP',
      description:
        'Initial release with browser, workspaces, AI sidebar, and product management.',
      downloadUrl:
        'https://files.catbox.moe/duyrzt.zip',
      checksum: 'sha256:eef08900cb340a09acb668244d513aff1784458a1a8c12d15e60f73afe203d9b',
      fileSize: BigInt(144720011),
      channel: 'STABLE',
    },
  });

  const existing = await prisma.notification.findFirst({
    where: { title: 'Bienvenido a Madsjeez Seller Browser', isGlobal: true },
  });
  if (!existing) {
    await prisma.notification.create({
      data: {
        isGlobal: true,
        type: 'ANNOUNCEMENT',
        title: 'Bienvenido a Madsjeez Seller Browser',
        message:
          'El navegador diseñado para vendedores online de Latinoamérica ya está disponible.',
      },
    });
  }

  console.log('Seed completed. Admin:', admin.email);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
