import { v7 as uuid7 } from 'uuid';
import { AuthenticationExpiredError } from './errors.js';
import type { AuthenticationRow } from '../database/schema.js';

export default class Authentication {
  private static readonly TEN_MINUTES_MILLISECONDS = 600_000;
  private static readonly THIRTY_DAYS_MILLISECONDS = 2_592_000_000;

  private constructor(
    readonly id: string,
    readonly userExternalId: string,
    private _magicToken: string | null,
    private _token: string | null,
    private _authenticatedAt: Date | null,
    private _expiresAt: Date,
  ) {}

  static create(
    userExternalId: string,
    magicToken: string,
    now: Date,
  ): Authentication {
    return new Authentication(
      uuid7(),
      userExternalId,
      magicToken,
      null,
      null,
      Authentication.createExpiresAt(now),
    );
  }

  static fromRow(row: AuthenticationRow): Authentication {
    return new Authentication(
      row.id,
      row.userExternalId,
      row.magicToken,
      row.token,
      row.authenticatedAt,
      row.expiresAt,
    );
  }

  toRow(): AuthenticationRow {
    return {
      id: this.id,
      userExternalId: this.userExternalId,
      magicToken: this.magicToken,
      token: this.token,
      authenticatedAt: this.authenticatedAt,
      expiresAt: this.expiresAt,
    };
  }

  get magicToken(): string | null {
    return this._magicToken;
  }

  get token(): string | null {
    return this._token;
  }

  get authenticatedAt(): Date | null {
    return this._authenticatedAt;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  authenticate(token: string, now: Date): void {
    if (this.token) {
      throw new Error('Authentication already authenticated');
    }

    this.checkExpiration(now);

    this._magicToken = null;
    this._token = token;
    this._authenticatedAt = now;
    this._expiresAt = Authentication.createExpiresAt(
      now,
      Authentication.THIRTY_DAYS_MILLISECONDS,
    );
  }

  checkExpiration(now: Date): void {
    if (now > this.expiresAt) {
      throw new AuthenticationExpiredError();
    }
  }

  private static createExpiresAt(
    now: Date,
    expiration: number = Authentication.TEN_MINUTES_MILLISECONDS,
  ): Date {
    return new Date(now.getTime() + expiration);
  }
}
