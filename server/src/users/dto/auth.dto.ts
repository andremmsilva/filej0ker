import { IsEmail, IsString, Length, Matches } from 'class-validator';

export type UserSQL = {
  userid: number;
  fullname: string;
  email: string;
  username: string;
  passwordhash: string;
  createdat: Date;
  userrole: string;
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
  userId!: number;
  email!: string;
  username!: string;
  fullName!: string;
  createdAt!: Date;
  userRole!: string;
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
