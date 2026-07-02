# Database Schema

The Renewly database is built using PostgreSQL and Prisma ORM.

## Core Models

- **User**: The core account model.
- **Provider**: A service provider (e.g., Netflix, Spotify).
- **Category**: A grouping for providers (e.g., Entertainment, Software).
- **Subscription**: A recurring payment linked to a User and Provider.
- **Purchase**: A one-time or recurring charge event.
- **Reminder**: Alerts configured for upcoming subscription renewals.
- **PaymentMethod**: Saved payment sources for a User.

## Standard Fields

All models include:
- `id`: UUID (Primary Key)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update
- `deletedAt`: Optional timestamp for soft deletes (where appropriate)
