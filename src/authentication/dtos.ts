export interface AuthenticationDto {
  readonly id: string;
  readonly authenticatedAt: Date;
  readonly expiresAt: Date;
}
