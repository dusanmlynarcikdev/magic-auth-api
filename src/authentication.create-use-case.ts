import { Injectable } from '@nestjs/common';

import Authentication from './authentication.js';
import AuthenticationRepository from './authentication.repository.js';
import ClockProvider from './clock.provider.js';

@Injectable()
export default class AuthenticationCreateUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly clock: ClockProvider,
  ) {}

  async create(userExternalId: string): Promise<string> {
    const authentication = Authentication.create(
      userExternalId,
      this.clock.now(),
    );

    await this.authenticationRepository.add(authentication);

    return authentication.magicToken!;
  }
}
