import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticationAuthenticateRequest {
  @IsString()
  @IsNotEmpty()
  readonly magicToken!: string;
}

export class AuthenticationCreateRequest {
  @IsString()
  @IsNotEmpty()
  readonly userExternalId!: string;
}
