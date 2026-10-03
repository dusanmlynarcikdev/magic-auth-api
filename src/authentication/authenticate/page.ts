import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';

import {
  AuthenticationExpiredError,
  AuthenticationNotFoundError,
} from '../errors.js';
import { AuthenticationAuthenticateRequest } from '../requests.js';
import AuthenticationAuthenticateUseCase, {
  type AuthenticationAuthenticateResult,
} from './use-case.js';
import type { Response } from 'express';

@Controller('authenticate')
export default class AuthenticationAuthenticatePage {
  private static readonly COOKIE_MAXIMUM_DAYS_MILLISECONDS = 34_560_000_000;
  private static readonly COOKIE_NAME = 'auth_token';
  private static readonly DEFAULT_URL = '/';

  constructor(
    private readonly authenticateUseCase: AuthenticationAuthenticateUseCase,
  ) {}

  @Get()
  @Redirect()
  async authenticate(
    @Query() request: AuthenticationAuthenticateRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ url: string }> {
    let result: AuthenticationAuthenticateResult;

    try {
      result = await this.authenticateUseCase.execute(request.magicToken);
    } catch (error) {
      if (
        error instanceof AuthenticationNotFoundError ||
        error instanceof AuthenticationExpiredError
      ) {
        return this.createResponse(process.env.AUTHENTICATE_ERROR_URL);
      }

      throw error;
    }

    response.cookie(AuthenticationAuthenticatePage.COOKIE_NAME, result.token, {
      secure: true,
      sameSite: 'lax',
      maxAge: AuthenticationAuthenticatePage.COOKIE_MAXIMUM_DAYS_MILLISECONDS,
    });

    return this.createResponse(result.successUrl);
  }

  private createResponse(url: string | null | undefined): {
    url: string;
  } {
    return { url: url || AuthenticationAuthenticatePage.DEFAULT_URL };
  }
}
