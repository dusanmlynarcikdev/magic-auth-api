import {
  index,
  snakeCase,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const authentications = snakeCase.table(
  'authentications',
  {
    id: uuid().primaryKey(),
    userExternalId: varchar().notNull(),
    magicToken: varchar().unique(),
    successUrl: varchar(),
    token: varchar().unique(),
    userAgent: varchar(),
    authenticatedAt: timestamp({ withTimezone: true }),
    lastUsedAt: timestamp({ withTimezone: true }),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
  },
  (table) => [index().on(table.userExternalId), index().on(table.expiresAt)],
);

export type AuthenticationRow = typeof authentications.$inferSelect;
