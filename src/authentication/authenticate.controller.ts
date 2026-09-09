import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import AuthenticateUseCase from './authenticate.use-case.js';
import { AuthenticateRequest } from './requests.js';

@Controller('authentications/authenticate')
export default class AuthenticateController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() request: AuthenticateRequest) {
    const token = await this.authenticateUseCase.authenticate(
      request.magicToken,
    );

    return { token };
  }
}
