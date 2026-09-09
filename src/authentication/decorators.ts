import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type Authentication from './entity.js';
import type { AuthenticatedRequest } from './guard.js';

export const Auth = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Authentication =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().authentication,
);
