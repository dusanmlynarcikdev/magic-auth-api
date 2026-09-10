import { Body, Controller, Post } from '@nestjs/common';
import AuthenticationCreateUseCase from './use-case.js';
import { AuthenticationCreateRequest } from '../requests.js';

@Controller('authentications')
export default class AuthenticationCreateController {
  constructor(private readonly createUseCase: AuthenticationCreateUseCase) {}

  @Post()
  async create(@Body() request: AuthenticationCreateRequest) {
    const magicToken = await this.createUseCase.execute(request.userExternalId);

    return { magicToken };
  }
}
