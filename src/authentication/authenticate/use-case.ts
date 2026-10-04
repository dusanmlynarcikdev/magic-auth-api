import { Injectable } from '@nestjs/common';

import ClockProvider from '../../clock.provider.js';
import TokenProvider from '../../token.provider.js';
import AuthenticationRepository from '../repository.js';

export interface AuthenticationAuthenticateResult {
  readonly token: string;
  readonly successUrl: string | null;
}

@Injectable()
export default class AuthenticationAuthenticateUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly clockProvider: ClockProvider,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(
    magicToken: string,
    userAgent: string | null,
  ): Promise<AuthenticationAuthenticateResult> {
    const authentication = await this.authenticationRepository.getByMagicToken(
      this.tokenProvider.hash(magicToken),
    );

    const successUrl = authentication.successUrl;
    const token = this.tokenProvider.generate();
    authentication.authenticate(
      this.tokenProvider.hash(token),
      userAgent,
      this.clockProvider.now(),
    );
    await this.authenticationRepository.update(authentication);

    return { token, successUrl };
  }
}
