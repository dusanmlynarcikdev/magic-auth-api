import { Injectable } from '@nestjs/common';

import Authentication from '../entity.js';
import AuthenticationRepository from '../repository.js';

@Injectable()
export default class AuthenticationDeleteMeUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(authentication: Authentication): Promise<void> {
    await this.authenticationRepository.remove(authentication);
  }
}
