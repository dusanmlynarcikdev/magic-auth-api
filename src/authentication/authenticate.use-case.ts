import { Injectable } from '@nestjs/common';
import AuthenticationRepository from './repository.js';
import ClockProvider from '../clock.provider.js';
import TokenProvider from '../token.provider.js';

@Injectable()
export default class AuthenticateUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly clockProvider: ClockProvider,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async authenticate(magicToken: string): Promise<string> {
    const authentication = await this.authenticationRepository.getByMagicToken(
      this.tokenProvider.hash(magicToken),
    );

    const now = this.clockProvider.now();
    authentication.checkExpiration(now);

    const token = this.tokenProvider.generate();
    authentication.authenticate(this.tokenProvider.hash(token), now);
    this.authenticationRepository.update(authentication);

    return token;
  }
}
