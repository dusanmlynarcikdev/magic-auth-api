import { Injectable } from '@nestjs/common';
import Authentication from './entity.js';
import AuthenticationRepository from './repository.js';
import ClockProvider from '../clock.provider.js';
import TokenProvider from '../token.provider.js';

@Injectable()
export default class AuthenticationCreateUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly clockProvider: ClockProvider,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async create(userExternalId: string): Promise<string> {
    const magicToken = this.tokenProvider.generate();

    const authentication = Authentication.create(
      userExternalId,
      this.tokenProvider.hash(magicToken),
      this.clockProvider.now(),
    );

    await this.authenticationRepository.add(authentication);

    return magicToken;
  }
}
