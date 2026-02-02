import axios from "axios";
import { getAccessToken } from "./auth-tokens";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
