import { Injectable } from '@nestjs/common';

import { AuthenticationNotFoundError } from '../errors.js';
import AuthenticationRepository from '../repository.js';

@Injectable()
export default class AuthenticationDeleteUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(id: string, userExternalId: string): Promise<void> {
    const authentication = await this.authenticationRepository.get(id);

    if (authentication.userExternalId !== userExternalId) {
      throw new AuthenticationNotFoundError();
    }

    await this.authenticationRepository.remove(authentication);
  }
}
