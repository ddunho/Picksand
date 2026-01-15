import axios from "axios";
import { useMemo } from "react";

export const useAxios = () => {
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    // ✅ Request Interceptor: 토큰만 붙인다
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // ✅ Response Interceptor: 401에서 아무 것도 하지 않는다
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // ❗ 프로젝트용: 401이어도 로그아웃/재발급 안 함
        if (error.response?.status === 401) {
          console.warn("401 발생 (프로젝트용 무시):", error.config.url);
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return api;
};
