import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { Auth } from '../decorators.js';
import Authentication from '../entity.js';
import AuthenticationGuard from '../guard.js';
import AuthenticationDeleteUseCase from './use-case.js';

@Controller('authentications')
@UseGuards(AuthenticationGuard)
export default class AuthenticationDeleteController {
  constructor(private readonly deleteUseCase: AuthenticationDeleteUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Auth() authentication: Authentication,
  ) {
    await this.deleteUseCase.execute(id, authentication.userExternalId);
  }
}
