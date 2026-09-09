import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateRequest {
  @IsString()
  @IsNotEmpty()
  readonly magicToken!: string;
}

export class AuthenticationCreateRequest {
  @IsString()
  @IsNotEmpty()
  readonly userExternalId!: string;
}
