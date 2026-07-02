import { PrismaClient, ProviderType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Ensure a default Category exists for our providers
  const entertainment = await prisma.category.upsert({
    where: { slug: 'entertainment' },
    update: {},
    create: {
      name: 'Entertainment',
      slug: 'entertainment',
      description: 'Streaming, TV, Movies, and Music',
    },
  });

  const software = await prisma.category.upsert({
    where: { slug: 'software' },
    update: {},
    create: {
      name: 'Software',
      slug: 'software',
      description: 'Software subscriptions and services',
    },
  });

  const gaming = await prisma.category.upsert({
    where: { slug: 'gaming' },
    update: {},
    create: {
      name: 'Gaming',
      slug: 'gaming',
      description: 'Video games and gaming subscriptions',
    },
  });

  // 2. Providers to seed
  const providersData = [
    {
      name: 'Netflix',
      slug: 'netflix',
      type: ProviderType.ENTERTAINMENT,
      categoryId: entertainment.id,
      iconUrl: 'https://placeholder.com/icons/netflix',
      websiteUrl: 'https://netflix.com',
      billingUrl: 'https://netflix.com/YourAccount',
    },
    {
      name: 'Prime Video',
      slug: 'prime-video',
      type: ProviderType.ENTERTAINMENT,
      categoryId: entertainment.id,
      iconUrl: 'https://placeholder.com/icons/prime-video',
      websiteUrl: 'https://primevideo.com',
      billingUrl: 'https://amazon.com/your-account',
    },
    {
      name: 'Spotify',
      slug: 'spotify',
      type: ProviderType.ENTERTAINMENT,
      categoryId: entertainment.id,
      iconUrl: 'https://placeholder.com/icons/spotify',
      websiteUrl: 'https://spotify.com',
      billingUrl: 'https://spotify.com/account',
    },
    {
      name: 'Steam',
      slug: 'steam',
      type: ProviderType.GAMING,
      categoryId: gaming.id,
      iconUrl: 'https://placeholder.com/icons/steam',
      websiteUrl: 'https://store.steampowered.com',
      billingUrl: 'https://store.steampowered.com/account/',
    },
    {
      name: 'Epic Games',
      slug: 'epic-games',
      type: ProviderType.GAMING,
      categoryId: gaming.id,
      iconUrl: 'https://placeholder.com/icons/epic-games',
      websiteUrl: 'https://store.epicgames.com',
      billingUrl: 'https://store.epicgames.com/account',
    },
    {
      name: 'PlayStation',
      slug: 'playstation',
      type: ProviderType.GAMING,
      categoryId: gaming.id,
      iconUrl: 'https://placeholder.com/icons/playstation',
      websiteUrl: 'https://playstation.com',
      billingUrl: 'https://playstation.com/acct',
    },
    {
      name: 'Xbox',
      slug: 'xbox',
      type: ProviderType.GAMING,
      categoryId: gaming.id,
      iconUrl: 'https://placeholder.com/icons/xbox',
      websiteUrl: 'https://xbox.com',
      billingUrl: 'https://account.microsoft.com',
    },
    {
      name: 'Apple',
      slug: 'apple',
      type: ProviderType.SOFTWARE,
      categoryId: software.id,
      iconUrl: 'https://placeholder.com/icons/apple',
      websiteUrl: 'https://apple.com',
      billingUrl: 'https://appleid.apple.com',
    },
    {
      name: 'Google',
      slug: 'google',
      type: ProviderType.SOFTWARE,
      categoryId: software.id,
      iconUrl: 'https://placeholder.com/icons/google',
      websiteUrl: 'https://google.com',
      billingUrl: 'https://myaccount.google.com',
    },
    {
      name: 'GitHub',
      slug: 'github',
      type: ProviderType.SOFTWARE,
      categoryId: software.id,
      iconUrl: 'https://placeholder.com/icons/github',
      websiteUrl: 'https://github.com',
      billingUrl: 'https://github.com/settings/billing',
    },
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      type: ProviderType.SOFTWARE,
      categoryId: software.id,
      iconUrl: 'https://placeholder.com/icons/chatgpt',
      websiteUrl: 'https://chat.openai.com',
      billingUrl: 'https://platform.openai.com/account/billing',
    },
    {
      name: 'Adobe',
      slug: 'adobe',
      type: ProviderType.SOFTWARE,
      categoryId: software.id,
      iconUrl: 'https://placeholder.com/icons/adobe',
      websiteUrl: 'https://adobe.com',
      billingUrl: 'https://account.adobe.com',
    },
    {
      name: 'Microsoft',
      slug: 'microsoft',
      type: ProviderType.SOFTWARE,
      categoryId: software.id,
      iconUrl: 'https://placeholder.com/icons/microsoft',
      websiteUrl: 'https://microsoft.com',
      billingUrl: 'https://account.microsoft.com',
    },
  ];

  for (const provider of providersData) {
    await prisma.provider.upsert({
      where: { slug: provider.slug },
      update: provider,
      create: provider,
    });
    console.log(`Upserted provider: ${provider.name}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
