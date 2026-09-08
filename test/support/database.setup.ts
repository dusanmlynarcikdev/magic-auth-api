import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

const DUPLICATE_DATABASE_ERROR_CODE = '42P04';

export async function setup(): Promise<void> {
  const databaseUrl = new URL(process.env.DATABASE_URL!);

  await createDatabase(databaseUrl);
  await migrateDatabase(databaseUrl);
}

async function createDatabase(databaseUrl: URL): Promise<void> {
  const databaseName = databaseUrl.pathname.slice(1);

  const postgresUrl = new URL(databaseUrl);
  postgresUrl.pathname = '/postgres';

  const client = new Client({ connectionString: postgresUrl.toString() });
  await client.connect();

  try {
    await client.query(`create database "${databaseName}"`);
  } catch (error) {
    if ((error as { code?: string }).code !== DUPLICATE_DATABASE_ERROR_CODE) {
      throw error;
    }
  } finally {
    await client.end();
  }
}

async function migrateDatabase(databaseUrl: URL): Promise<void> {
  const db = drizzle(databaseUrl.toString());

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
  } finally {
    await db.$client.end();
  }
}
