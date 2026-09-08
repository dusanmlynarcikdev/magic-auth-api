import { and, desc, eq, gte, lt, isNotNull, type SQL } from 'drizzle-orm';
import Authentication from './authentication.js';
import { AuthenticationNotFoundError } from './authentication.errors.js';
import { db } from './database.client.js';
import { authentications } from './database.schema.js';

export default class AuthenticationRepository {
  async add(authentication: Authentication): Promise<void> {
    await db.insert(authentications).values(authentication.toRow());
  }

  async get(id: string): Promise<Authentication> {
    return this.getBy(eq(authentications.id, id));
  }

  async getByMagicToken(magicToken: string): Promise<Authentication> {
    return this.getBy(eq(authentications.magicToken, magicToken));
  }

  async getByToken(token: string): Promise<Authentication> {
    return this.getBy(eq(authentications.token, token));
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

  private async getBy(where: SQL): Promise<Authentication> {
    const [row] = await db.select().from(authentications).where(where);

    if (!row) {
      throw new AuthenticationNotFoundError();
    }

    return Authentication.fromRow(row);
  }
}
