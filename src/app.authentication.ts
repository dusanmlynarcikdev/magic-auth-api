import { randomBytes } from 'node:crypto';
import { v7 as uuid7 } from 'uuid';
import {
  AuthenticationAlreadyAuthenticatedError,
  AuthenticationExpiredError,
} from './app.exceptions.js';

export default class Authentication {
  private static readonly TEN_MINUTES_MILLISECONDS = 600_000;
  private static readonly THIRTY_DAYS_MILLISECONDS = 2_592_000_000;

  readonly id: string = uuid7();
  private _magicToken: string | null = this.generateToken();
  private _token: string | null = null;
  private _authenticatedAt: Date | null = null;
  private _expiresAt: Date;

  constructor(
    readonly userExternalId: string,
    now: Date,
  ) {
    this._expiresAt = this.createExpiresAt(
      now,
      Authentication.TEN_MINUTES_MILLISECONDS,
    );
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

  authenticate(now: Date) {
    if (this.token) {
      throw new AuthenticationAlreadyAuthenticatedError();
    }

    if (now > this.expiresAt) {
      throw new AuthenticationExpiredError();
    }

    this._magicToken = null;
    this._token = this.generateToken();
    this._authenticatedAt = now;
    this._expiresAt = this.createExpiresAt(
      now,
      Authentication.THIRTY_DAYS_MILLISECONDS,
    );
  }

  private createExpiresAt(now: Date, expiration: number) {
    return new Date(now.getTime() + expiration);
  }

  private generateToken(): string {
    return randomBytes(32).toString('base64url');
  }
}
