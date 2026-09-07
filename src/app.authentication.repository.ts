import { and, desc, eq, gte, lt, isNotNull } from 'drizzle-orm';
import Authentication from './app.authentication.js';
import { db } from './database.index.js';
import { authentications } from './database.schema.js';

export default class AuthenticationRepository {
  async add(authentication: Authentication): Promise<void> {
    await db.insert(authentications).values(authentication.toRow());
  }

  async findOneUnexpiredByMagicToken(
    magicToken: string,
    now: Date,
  ): Promise<Authentication | null> {
    const [row] = await db
      .select()
      .from(authentications)
      .where(
        and(
          eq(authentications.magicToken, magicToken),
          gte(authentications.expiresAt, now),
        ),
      )
      .limit(1);

    return row ? Authentication.fromRow(row) : null;
  }

  async findOneUnexpiredByToken(
    token: string,
    now: Date,
  ): Promise<Authentication | null> {
    const [row] = await db
      .select()
      .from(authentications)
      .where(
        and(
          eq(authentications.token, token),
          gte(authentications.expiresAt, now),
        ),
      )
      .limit(1);

    return row ? Authentication.fromRow(row) : null;
  }

  async findUnexpiredWithTokenByUserExternalId(
    userExternalId: string,
    now: Date,
  ): Promise<Authentication[]> {
    const rows = await db
      .select()
      .from(authentications)
      .where(
        and(
          eq(authentications.userExternalId, userExternalId),
          isNotNull(authentications.token),
          gte(authentications.expiresAt, now),
        ),
      )
      .orderBy(desc(authentications.id));

    return rows.map((row) => Authentication.fromRow(row));
  }

  async remove(authentication: Authentication): Promise<void> {
    await db
      .delete(authentications)
      .where(eq(authentications.id, authentication.id));
  }

  async removeExpired(now: Date): Promise<void> {
    await db.delete(authentications).where(lt(authentications.expiresAt, now));
  }

  async update(authentication: Authentication): Promise<void> {
    await db
      .update(authentications)
      .set(authentication.toRow())
      .where(eq(authentications.id, authentication.id));
  }
}
