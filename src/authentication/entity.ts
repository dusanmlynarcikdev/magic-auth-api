import { v7 as uuid7 } from 'uuid';

import type { AuthenticationRow } from '../database/schema.js';
import { AuthenticationExpiredError } from './errors.js';

export default class Authentication {
  private static readonly TEN_MINUTES_MILLISECONDS = 600_000;
  private static readonly THIRTY_DAYS_MILLISECONDS = 2_592_000_000;

  private constructor(
    readonly id: string,
    readonly userExternalId: string,
    private _magicToken: string | null,
    private _successUrl: string | null,
    private _token: string | null,
    private _userAgent: string | null,
    private _authenticatedAt: Date | null,
    private _expiresAt: Date,
  ) {}

  static create(
    userExternalId: string,
    magicToken: string,
    successUrl: string | null,
    now: Date,
  ): Authentication {
    return new Authentication(
      uuid7(),
      userExternalId,
      magicToken,
      successUrl,
      null,
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
      row.successUrl,
      row.token,
      row.userAgent,
      row.authenticatedAt,
      row.expiresAt,
    );
  }

  toRow(): AuthenticationRow {
    return {
      id: this.id,
      userExternalId: this.userExternalId,
      magicToken: this.magicToken,
      successUrl: this.successUrl,
      token: this.token,
      userAgent: this.userAgent,
      authenticatedAt: this.authenticatedAt,
      expiresAt: this.expiresAt,
    };
  }

  get magicToken(): string | null {
    return this._magicToken;
  }

  get successUrl(): string | null {
    return this._successUrl;
  }

  get token(): string | null {
    return this._token;
  }

  get userAgent(): string | null {
    return this._userAgent;
  }

  get authenticatedAt(): Date | null {
    return this._authenticatedAt;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  authenticate(token: string, userAgent: string | null, now: Date): void {
    if (this.token) {
      throw new Error('Authentication already authenticated');
    }

    if (this.isExpired(now)) {
      throw new AuthenticationExpiredError();
    }

    this._magicToken = null;
    this._successUrl = null;
    this._token = token;
    this._userAgent = userAgent;
    this._authenticatedAt = now;
    this._expiresAt = Authentication.createExpiresAt(
      now,
      Authentication.THIRTY_DAYS_MILLISECONDS,
    );
  }

  isExpired(now: Date): boolean {
    return now > this.expiresAt;
  }

  private static createExpiresAt(
    now: Date,
    expiration: number = Authentication.TEN_MINUTES_MILLISECONDS,
  ): Date {
    return new Date(now.getTime() + expiration);
  }
}
