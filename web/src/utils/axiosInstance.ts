import { AuthService } from '@/services/authService';
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    const url: string = error.config.url;
    if (status !== 401 && status !== 403) {
      return Promise.reject(error);
    }

    if (url.includes('refresh')) {
      AuthService.logout();
      return Promise.reject(error);
    }

    const refreshResponse = await AuthService.refresh();
    if (refreshResponse.success) {
      return instance(error.config);
    }

    return Promise.reject(error);
  }
);

export { instance as axiosInstance };
