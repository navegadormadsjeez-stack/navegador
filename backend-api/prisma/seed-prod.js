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
    where: { version: '0.1.14' },
    update: {
      title: 'Madsjeez Seller Browser v0.1.14',
      description:
        'Registro completo como navegador Windows (HKLM): aparece en Apps predeterminadas, abre URLs/archivos por argumento, boton para elegir navegador predeterminado.',
      downloadUrl:
        'https://github.com/navegadormadsjeez-stack/navegador/releases/download/v0.1.14/MadsjeezSellerBrowserSetup.exe',
      checksum: 'sha256:7e0eaacd349974fc9a592620bfea83913ca2ba734980755c68b89d97c5cfa215',
      fileSize: BigInt(155906867),
      channel: 'STABLE',
    },
    create: {
      version: '0.1.14',
      title: 'Madsjeez Seller Browser v0.1.14',
      description:
        'Registro completo como navegador Windows (HKLM): aparece en Apps predeterminadas, abre URLs/archivos por argumento, boton para elegir navegador predeterminado.',
      downloadUrl:
        'https://github.com/navegadormadsjeez-stack/navegador/releases/download/v0.1.14/MadsjeezSellerBrowserSetup.exe',
      checksum: 'sha256:7e0eaacd349974fc9a592620bfea83913ca2ba734980755c68b89d97c5cfa215',
      fileSize: BigInt(155906867),
      channel: 'STABLE',
    },
  });

  await prisma.appUpdate.upsert({
    where: { version: '0.1.13' },
    update: {
      title: 'Madsjeez Seller Browser v0.1.13',
      description:
        'Nueva pantalla de Extensiones y herramientas integradas; reemplaza el popup de extensiones no disponibles.',
      downloadUrl:
        'https://github.com/navegadormadsjeez-stack/navegador/releases/download/v0.1.13/MadsjeezSellerBrowserSetup.exe',
      checksum: 'sha256:7e0eaacd349974fc9a592620bfea83913ca2ba734980755c68b89d97c5cfa215',
      fileSize: BigInt(155906867),
      channel: 'STABLE',
    },
    create: {
      version: '0.1.13',
      title: 'Madsjeez Seller Browser v0.1.13',
      description:
        'Nueva pantalla de Extensiones y herramientas integradas; reemplaza el popup de extensiones no disponibles.',
      downloadUrl:
        'https://github.com/navegadormadsjeez-stack/navegador/releases/download/v0.1.13/MadsjeezSellerBrowserSetup.exe',
      checksum: 'sha256:7e0eaacd349974fc9a592620bfea83913ca2ba734980755c68b89d97c5cfa215',
      fileSize: BigInt(155906867),
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
