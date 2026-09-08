import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticationCreateRequest {
  @IsString()
  @IsNotEmpty()
  readonly userExternalId!: string;
}
