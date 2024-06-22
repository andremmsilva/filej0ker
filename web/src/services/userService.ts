import {SearchRequestDTO} from "@/dto/user.dto";
import {axiosInstance} from "@/utils/axiosInstance";
import {BaseUserResponse} from "@/dto/auth.dto";

export interface SearchResult {
  response: BaseUserResponse[];
  success: boolean;
  error: string;
}

export class UserService {
  static async search(query: SearchRequestDTO): Promise<SearchResult> {
    try {
      const response = await axiosInstance.post<BaseUserResponse[]>('/users/', query);
      if (response.status === 200) {
        return {response: response.data, success: true, error: ""};
      }
      return {response: [], success: false, error: "Server returned an invalid response. Please try again later."};
    } catch (error: any) {
      if (error.response) {
        return {
          response: [],
          success: false,
          error: error.response.data.message ?
            error.response.data.message :
            error.response.data
        };
      } else {
        return {
          response: [],
          success: false,
          error: "An error occurred when processing your request. Please try again later."
        };
      }
    }
  }
}
