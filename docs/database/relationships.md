# Database Relationships

- **User -> Subscription (1:N)**: A user can have multiple subscriptions. If a user is deleted, subscriptions are cascaded.
- **User -> Purchase (1:N)**: A user can have multiple purchases. Cascades on user deletion.
- **User -> PaymentMethod (1:N)**: A user has multiple payment methods. Cascades on user deletion.
- **Subscription -> Reminder (1:N)**: A subscription can have multiple reminders (e.g., 3 days before, 1 day before). Cascades on subscription deletion.
- **Provider -> Subscription (1:N)**: A provider (e.g. Netflix) can be linked to many subscriptions. `Restrict` on deletion (cannot delete a provider if it has active subscriptions).
- **Category -> Provider (1:N)**: A category contains many providers.
