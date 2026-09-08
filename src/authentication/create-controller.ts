import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import AuthenticationCreateUseCase from './create-use-case.js';
import { AuthenticationCreateRequest } from './requests.js';

@Controller('authentications')
export default class AuthenticationCreateController {
  constructor(private readonly createUseCase: AuthenticationCreateUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: AuthenticationCreateRequest) {
    const magicToken = await this.createUseCase.create(request.userExternalId);

    return { magicToken };
  }
}
