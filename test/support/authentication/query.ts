import { db } from '../../../src/database/client.js';
import {
  authentications,
  type AuthenticationRow,
} from '../../../src/database/schema.js';

export default class AuthenticationQuery {
  static async findAll(): Promise<AuthenticationRow[]> {
    return await db.select().from(authentications);
  }
}
