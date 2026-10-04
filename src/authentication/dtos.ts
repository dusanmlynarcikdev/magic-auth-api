export interface AuthenticationDto {
  readonly id: string;
  readonly userAgent: string | null;
  readonly authenticatedAt: Date;
  readonly expiresAt: Date;
}
