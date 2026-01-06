import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import React, { useMemo } from "react";

export const useAxios = () => {
  const { accessToken, refreshToken, setAccessToken, setRefreshToken, logout } =
    React.useContext(AuthContext);

  // Axios 인스턴스 생성
  const api = useMemo(() => {
  return axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/server-a`,
  });
}, []);

  // 요청 인터셉터
  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  });

  // 응답 인터셉터
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      // originalRequest or url undefined 방지
      if (originalRequest?.url?.includes("/members/logout")) {
        return Promise.reject(error);
      }

      const status = error.response?.status;

      // 401 + 403 모두 Refresh 대상
      if ((status === 401 || status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/members/reissue`,
            { refreshToken },
            { withCredentials: true }
          );

          const newAccess = response.data.accessToken;
          const newRefresh = response.data.refreshToken;

          // 토큰 갱신
          setAccessToken(newAccess);
          setRefreshToken(newRefresh);

          // 실패했던 요청 헤더에 새 토큰 삽입
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccess}`,
          };

          // 다시 요청
          return api(originalRequest);
        } catch (e) {
          // Refresh Token도 만료 → 강제 로그아웃
          logout();
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
