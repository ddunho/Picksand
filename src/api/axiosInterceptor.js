import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import React, { useMemo, useContext } from "react";

export const useAxios = () => {
  const {
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    logout,
  } = useContext(AuthContext);

  // 일반 API용 axios
  const api = useMemo(() => {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
  }, []);

  // refresh 전용 axios (인터셉터 없음)
  const refreshApi = useMemo(() => {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
  }, []);

  /* ======================
     Request Interceptor
     ====================== */
  api.interceptors.request.use((config) => {
    if (
      accessToken &&
      !config.url?.includes("/members/reissue")
    ) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  });

  /* ======================
     Response Interceptor
     ====================== */
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      // logout / reissue 요청은 건드리지 않음
      if (
        originalRequest?.url?.includes("/members/logout") ||
        originalRequest?.url?.includes("/members/reissue")
      ) {
        return Promise.reject(error);
      }

      // 🔥 오직 401만 refresh 대상
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await refreshApi.post(
            "/server-a/members/reissue",
            { refreshToken }
          );

          const newAccess = response.data.accessToken;
          const newRefresh = response.data.refreshToken;

          setAccessToken(newAccess);
          setRefreshToken(newRefresh);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccess}`,
          };

          return api(originalRequest);
        } catch (e) {
          // refresh 토큰까지 실패 → 진짜 로그아웃
          logout();
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
