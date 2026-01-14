import axios from "axios";
import React, { useContext, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAxios = () => {
  const {
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    logout,
  } = useContext(AuthContext);

  const api = useMemo(() => {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
  }, []);

  const refreshApi = useMemo(() => {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
  }, []);

  useEffect(() => {
    // ✅ request interceptor
    const reqId = api.interceptors.request.use((config) => {
      // refresh 요청에는 access token 절대 붙이지 않음
      if (accessToken && !config.url?.includes("/members/reissue")) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
      return config;
    });

    // ✅ response interceptor
    const resId = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // logout/reissue 요청은 그대로 던짐
        if (
          originalRequest?.url?.includes("/members/logout") ||
          originalRequest?.url?.includes("/members/reissue")
        ) {
          return Promise.reject(error);
        }

        // ✅ 401만 refresh 시도 (403은 refresh 대상 아님)
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
            logout();
            return Promise.reject(e);
          }
        }

        return Promise.reject(error);
      }
    );

    // ✅ cleanup: 인터셉터 누적 방지
    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [api, refreshApi, accessToken, refreshToken, setAccessToken, setRefreshToken, logout]);

  return api;
};
