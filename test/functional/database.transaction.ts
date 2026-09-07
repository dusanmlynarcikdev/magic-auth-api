import { sql } from 'drizzle-orm';
import { db } from '../../src/database.index.js';

// only queries on the same connection
db.$client.options.max = 1;

beforeEach(() => db.execute(sql`begin`));

afterEach(() => db.execute(sql`rollback`));
