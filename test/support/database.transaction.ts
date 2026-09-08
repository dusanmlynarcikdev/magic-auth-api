import { sql } from 'drizzle-orm';
import { db } from '../../src/database.client.js';

// ensure all queries use the same connection
db.$client.options.max = 1;

// keep that connection open so a slow test cannot lose the open transaction
db.$client.options.idleTimeoutMillis = 0;

beforeEach(() => db.execute(sql`begin`));

afterEach(() => db.execute(sql`rollback`));
