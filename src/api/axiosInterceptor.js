import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import React, { useMemo } from "react";

export const useAxios = () => {
  const { accessToken, refreshToken, setAccessToken, setRefreshToken, logout } =
    React.useContext(AuthContext);

  // Axios 인스턴스 생성 (메모이제이션)
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/server-a`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 요청 인터셉터
    instance.interceptors.request.use(
      (config) => {
        console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        
        // reissue 요청이 아닌 경우에만 토큰 추가
        if (accessToken && !config.url?.includes("/members/reissue")) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          console.log('🔑 Token added');
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    instance.interceptors.response.use(
      (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        console.error('❌ Response error:', status, originalRequest?.url);

        // logout, reissue 요청은 재시도 안 함
        if (
          originalRequest?.url?.includes("/members/logout") ||
          originalRequest?.url?.includes("/members/reissue")
        ) {
          return Promise.reject(error);
        }

        // 401/403이고 재시도 안 한 경우
        if ((status === 401 || status === 403) && !originalRequest._retry) {
          originalRequest._retry = true;

          console.log('🔄 Attempting token refresh...');

          try {
            // 토큰 갱신 요청
            const response = await axios.post(
              `${process.env.REACT_APP_API_URL}/server-a/members/reissue`,
              { refreshToken },
              { 
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
              }
            );

            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            console.log('✅ Token refreshed successfully');

            // 새 토큰 저장
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            // 원래 요청에 새 토큰 적용
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // 원래 요청 재시도
            return instance(originalRequest);
            
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            
            // 로그아웃 처리
            logout();
            
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [accessToken, refreshToken, setAccessToken, setRefreshToken, logout]);

  return api;
};