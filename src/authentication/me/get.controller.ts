import { Controller, Get, UseGuards } from '@nestjs/common';

import { Auth } from '../decorators.js';
import Authentication from '../entity.js';
import AuthenticationGuard from '../guard.js';

@Controller('authentications')
@UseGuards(AuthenticationGuard)
export default class AuthenticationGetMeController {
  @Get('me')
  getMe(@Auth() authentication: Authentication) {
    return { userExternalId: authentication.userExternalId };
  }
}
