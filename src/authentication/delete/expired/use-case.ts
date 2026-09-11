import { Injectable } from '@nestjs/common';
import ClockProvider from '../../../clock.provider.js';
import AuthenticationRepository from '../../repository.js';

@Injectable()
export default class AuthenticationDeleteExpiredUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly clockProvider: ClockProvider,
  ) {}

  async execute(): Promise<void> {
    await this.authenticationRepository.removeExpired(this.clockProvider.now());
  }
}
