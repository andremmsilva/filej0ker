import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(function (config) {
  return config;
})

export {instance as axiosInstance};
