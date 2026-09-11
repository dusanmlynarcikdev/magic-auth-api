import { db } from '../../../src/database/client.js';
import {
  type AuthenticationRow,
  authentications,
} from '../../../src/database/schema.js';

export default class AuthenticationQuery {
  static async findAll(): Promise<AuthenticationRow[]> {
    return await db.select().from(authentications);
  }
}
