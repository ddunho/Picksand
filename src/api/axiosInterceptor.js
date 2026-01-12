import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import React, { useMemo } from "react";

export const useAxios = () => {
  const { accessToken, refreshToken, setAccessToken, setRefreshToken, logout } =
    React.useContext(AuthContext);

  // Axios 인스턴스 생성
  const api = useMemo(() => {
  return axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
  });
}, []);

  // 요청 인터셉터
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
  // 응답 인터셉터
  api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest?.url?.includes("/members/logout") ||
      originalRequest?.url?.includes("/members/reissue")
    ) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/server-a/members/reissue`,
          { refreshToken },
          { withCredentials: true }
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

  return api;
};
