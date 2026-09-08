import { Injectable } from '@nestjs/common';

import Authentication from './authentication.js';
import AuthenticationRepository from './authentication.repository.js';

@Injectable()
export default class AuthenticationCreateUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async create(userExternalId: string): Promise<string> {
    const authentication = Authentication.create(userExternalId, new Date());

    await this.authenticationRepository.add(authentication);

    return authentication.magicToken!;
  }
}
