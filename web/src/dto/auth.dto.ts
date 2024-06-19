export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface SignupRequestDTO {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface BaseUserResponse {
  user_id: number;
  email: string;
  user_name: string;
  full_name: string;
  created_at: Date;
  user_role: string;
  active: boolean;
}

export interface BaseJWTResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDto {
  user: BaseUserResponse;
  auth: BaseJWTResponse;
}
