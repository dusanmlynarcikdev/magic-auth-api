import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { Auth } from '../decorators.js';
import Authentication from '../entity.js';
import AuthenticationGuard from '../guard.js';
import AuthenticationDeleteMeUseCase from './delete.use-case.js';

@Controller('authentications')
@UseGuards(AuthenticationGuard)
export default class AuthenticationDeleteMeController {
  constructor(
    private readonly deleteMeUseCase: AuthenticationDeleteMeUseCase,
  ) {}

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMe(@Auth() authentication: Authentication) {
    await this.deleteMeUseCase.execute(authentication);
  }
}
