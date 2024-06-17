import { IsEmail, IsString, Length, Matches } from 'class-validator';

export type UserSQL = {
  user_id: number;
  full_name: string;
  email: string;
  user_name: string;
  password_hash: string;
  created_at: Date;
  user_role: string;
  active: boolean;
};

abstract class BaseUserRequest {
  @IsEmail()
  email!: string;
}

export class LoginRequestDTO extends BaseUserRequest {
  @IsString()
  //@Length(6) TODO - Production should validate passwords more thoroughly
  password!: string;
}

export class RegisterRequestDTO extends LoginRequestDTO {
  @IsString()
  @Length(3, 32)
  @Matches(/^[a-zA-Z0-9\-\_\.]+$/, {
    message:
      'Username must be 3-32 characters long and can contain letters, digits, hyphens, underscores, and periods.',
  })
  username!: string;

  @IsString()
  @Length(5, 255)
  @Matches(/^[\p{L} ]+$/u, {
    message:
      'Full name must be 5-255 characters long and can contain only letters and spaces, including Latin characters.',
  })
  fullName!: string;
}

export class BaseUserResponse {
  user_id!: number;
  email!: string;
  user_name!: string;
  full_name!: string;
  created_at!: Date;
  user_role!: string;
  active!: boolean;
}

export class BaseJWTResponse {
  accessToken!: string;
  refreshToken!: string;
}

export class AuthResponseDto {
  user!: BaseUserResponse;
  auth!: BaseJWTResponse;
}
