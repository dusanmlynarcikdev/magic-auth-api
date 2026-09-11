import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthenticationAuthenticateRequest } from '../requests.js';
import AuthenticationAuthenticateUseCase from './use-case.js';

@Controller('authentications')
export default class AuthenticationAuthenticateController {
  constructor(
    private readonly authenticateUseCase: AuthenticationAuthenticateUseCase,
  ) {}

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() request: AuthenticationAuthenticateRequest) {
    const token = await this.authenticateUseCase.execute(request.magicToken);

    return { token };
  }
}
