import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@madsjeez.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isAdmin: true },
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
        ],
      },
    },
  });

  await prisma.appUpdate.upsert({
    where: { version: '0.1.0' },
    update: {},
    create: {
      version: '0.1.0',
      title: 'Madsjeez Seller Browser MVP',
      description: 'Initial release with browser, workspaces, AI sidebar, and product management.',
      downloadUrl: 'https://updates.madsjeez.com/releases/0.1.0/MadsjeezSellerBrowser-setup.exe',
      checksum: 'sha256:placeholder',
      fileSize: BigInt(85000000),
      channel: 'STABLE',
    },
  });

  await prisma.notification.create({
    data: {
      isGlobal: true,
      type: 'ANNOUNCEMENT',
      title: 'Bienvenido a Madsjeez Seller Browser',
      message: 'El navegador diseñado para vendedores online de Latinoamérica ya está disponible.',
    },
  });

  console.log('Seed completed. Admin:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
