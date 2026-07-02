# Database Migration Guide

## Prisma Migrations Workflow

We use Prisma Migrate for managing database schema changes. Follow these steps when making changes to the `schema.prisma` file.

1. **Make Changes**: Update `apps/api/prisma/schema.prisma`.
2. **Generate Migration**: Run `pnpm db:migrate` (or `npx prisma migrate dev --name <description>`). This will generate a SQL migration file in `prisma/migrations/`.
3. **Review**: Always review the generated SQL file to ensure no unintended data loss (e.g., dropping a column instead of renaming it).
4. **Deploy**: In production, the CI/CD pipeline will automatically run `prisma migrate deploy` to apply pending migrations securely.

> [!WARNING]
> Never modify existing migration files once they have been committed and applied to production. Always create a new migration for subsequent changes.

## Commands
- `pnpm db:generate`: Generates the Prisma Client.
- `pnpm db:migrate`: Creates and applies local migrations.
- `pnpm db:push`: Pushes schema changes directly without creating migration files (only for rapid prototyping).
- `pnpm db:reset`: Drops the database, reapplies migrations, and runs the seed script.
