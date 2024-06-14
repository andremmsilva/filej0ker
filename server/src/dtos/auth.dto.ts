import { IsEmail, IsString, Length } from "class-validator";

export type UserSQL = {
  userid: number;
  fullname: string;
  email: string;
  username: string;
  passwordhash: string;
  createdat: Date;
  userrole: string;
  active: boolean;
}

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
  username!: string;

  @IsString()
  @Length(5, 255)
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

export class BaseAuthResponse {
  user!: BaseUserResponse;
  auth!: BaseJWTResponse;
}

export function sqlToBaseUserResponse(user: UserSQL): BaseUserResponse {
  return {
    userId: user.userid,
    email: user.email,
    username: user.username,
    fullName: user.fullname,
    createdAt: user.createdat,
    userRole: user.userrole,
    active: user.active
  };
}
