import {AuthResponseDto, BaseJWTResponse, BaseUserResponse, LoginRequestDTO, SignupRequestDTO} from "@/dto/auth.dto";
import {axiosInstance} from "@/utils/axiosInstance";

export interface AuthResult {
  success: boolean;
  error: string;
}

export class AuthService {
  static async login(dto: LoginRequestDTO): Promise<AuthResult> {
    try {
      const response = await axiosInstance.post<AuthResponseDto>("/auth/login", dto);
      if (response.data.auth && response.data.user) {
        localStorage.setItem('auth', JSON.stringify(response.data.auth));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return {success: true, error: ""};
      }

      return {success: false, error: "Server returned an invalid response. Please try again later."};
    } catch (error: any) {
      if (error.response) {
        return {success: false, error: error.response.data.message};
      } else {
        console.error(error);
        return {success: false, error: "An error occurred. Please try again."};
      }
    }
  }

  static async signup(dto: SignupRequestDTO): Promise<AuthResult> {
    try {
      const response = await axiosInstance.post<AuthResponseDto>("/auth/signup", dto);
      if (response.data.auth && response.data.user) {
        localStorage.setItem('auth', JSON.stringify(response.data.auth));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return {success: true, error: ""};
      }

      return {success: false, error: "Server returned an invalid response. Please try again later."};
    } catch (error: any) {
      if (error.response) {
        return {success: false, error: error.response.data.message};
      } else {
        console.error(error);
        return {success: false, error: "An error occurred. Please try again."};
      }
    }
  }

  static logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
  }

  static getCurrentUser(): BaseUserResponse | null {
    const item = localStorage.getItem('user');
    return item ? JSON.parse(item) : null;
  }

  static getCurrentAuth(): BaseJWTResponse | null {
    const item = localStorage.getItem('auth');
    return item ? JSON.parse(item) : null;
  }
}
