import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const providers = await prisma.provider.findMany({ include: { category: true } });
  console.log(`Found ${providers.length} providers`);
  if (providers.length === 13) console.log("Prisma Client successfully queried all seeded data and relations!");
}
main().then(() => prisma.$disconnect());
