import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import AuthenticationAuthenticateUseCase from './use-case.js';
import { AuthenticationAuthenticateRequest } from '../requests.js';

@Controller('authentications/authenticate')
export default class AuthenticationAuthenticateController {
  constructor(
    private readonly authenticateUseCase: AuthenticationAuthenticateUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() request: AuthenticationAuthenticateRequest) {
    const token = await this.authenticateUseCase.execute(request.magicToken);

    return { token };
  }
}
