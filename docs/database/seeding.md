# Database Seeding

The seed script is located at `apps/api/prisma/seed.ts`. It populates the database with essential initial data such as base `Categories` and standard `Providers` (e.g., Netflix, Spotify, Steam).

## Running the Seed
You can run the seed manually using:
```bash
pnpm db:seed
```

## Idempotency
The seed script is designed to be idempotent using Prisma's `upsert` method. This means you can run the script multiple times without duplicating data or crashing.

## Adding New Providers
To add a new provider:
1. Open `apps/api/prisma/seed.ts`.
2. Add the provider to the `providersData` array.
3. Ensure it has a unique slug and links to an existing Category.
4. Run `pnpm db:seed` again to insert it into your local environment.
