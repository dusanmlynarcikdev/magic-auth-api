import type { AuthenticationDto } from './dtos.js';

export interface AuthenticationResponse extends AuthenticationDto {
  readonly isCurrent?: true;
}
