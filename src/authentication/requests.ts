import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class AuthenticationAuthenticateRequest {
  @IsString()
  @IsNotEmpty()
  readonly magicToken!: string;
}

export class AuthenticationCreateRequest {
  @IsString()
  @IsNotEmpty()
  readonly userExternalId!: string;

  @IsOptional()
  @IsUrl({
    protocols: ['https'],
    require_host: false,
  })
  readonly successUrl?: string | null;
}
