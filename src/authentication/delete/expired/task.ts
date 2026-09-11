import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import AuthenticationDeleteExpiredUseCase from './use-case.js';

@Injectable()
export default class AuthenticationDeleteExpiredTask {
  constructor(
    private readonly deleteExpiredUseCase: AuthenticationDeleteExpiredUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async execute(): Promise<void> {
    await this.deleteExpiredUseCase.execute();
  }
}
