import { Controller, Get, UseGuards } from '@nestjs/common';

import ClockProvider from '../clock.provider.js';
import { Auth } from './decorators.js';
import type { AuthenticationDto } from './dtos.js';
import Authentication from './entity.js';
import AuthenticationGuard from './guard.js';
import AuthenticationRepository from './repository.js';

@Controller('authentications')
@UseGuards(AuthenticationGuard)
export default class AuthenticationListController {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly clockProvider: ClockProvider,
  ) {}

  @Get()
  async list(
    @Auth() authentication: Authentication,
  ): Promise<AuthenticationDto[]> {
    return this.authenticationRepository.findUnexpiredWithTokenByUserExternalId(
      authentication.userExternalId,
      this.clockProvider.now(),
    );
  }
}
