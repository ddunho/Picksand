import axios from "axios";
import React, { useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAxios = () => {
  const { accessToken } = useContext(AuthContext);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    // ✅ request interceptor를 instance 생성 시 등록
    instance.interceptors.request.use((config) => {
      // ✅ localStorage에서 최신 토큰을 가져옴
      const token = localStorage.getItem("accessToken");
      
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      
      console.log("🔍 Request Config:", {
        url: config.url,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + "..." : "없음"
      });
      
      return config;
    });

    // ✅ response interceptor 추가 (401 처리)
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 401 에러 && 재시도 아닌 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            
            if (!refreshToken) {
              throw new Error("No refresh token");
            }

            // Refresh token으로 재발급
            const { data } = await axios.post(
              `${process.env.REACT_APP_API_URL}/server-a/members/reissue`,
              { refreshToken }
            );

            // 새 토큰 저장
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return instance(originalRequest);

          } catch (refreshError) {
            // Refresh token도 만료 → 로그아웃
            console.error("토큰 갱신 실패:", refreshError);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, []); // ✅ 빈 배열: 한 번만 생성

  return api;
};