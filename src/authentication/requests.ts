import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

const IsNullable = (): PropertyDecorator =>
  ValidateIf((_, value) => value !== null);

export class AuthenticationAuthenticatePageRequest {
  @IsString()
  @IsNotEmpty()
  readonly magicToken!: string;
}

export class AuthenticationAuthenticateRequest extends AuthenticationAuthenticatePageRequest {
  @IsNullable()
  @IsString({ message: '$property must be a string or null' })
  @IsNotEmpty()
  readonly userAgent!: string | null;
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
