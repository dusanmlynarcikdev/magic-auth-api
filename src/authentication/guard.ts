import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import type Authentication from './entity.js';
import AuthenticationRepository from './repository.js';
import ClockProvider from '../clock.provider.js';
import TokenProvider from '../token.provider.js';

export interface AuthenticatedRequest extends Request {
  authentication: Authentication;
}

@Injectable()
export default class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly clockProvider: ClockProvider,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = AuthenticationGuard.extractToken(request);

    const authentication = await this.authenticationRepository.findOneByToken(
      this.tokenProvider.hash(token),
    );

    if (!authentication || authentication.isExpired(this.clockProvider.now())) {
      throw new UnauthorizedException();
    }

    (request as AuthenticatedRequest).authentication = authentication;

    return true;
  }

  private static extractToken(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    return token;
  }
}
