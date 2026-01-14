import axios from "axios";
import React, { useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAxios = () => {
  const { accessToken } = useContext(AuthContext);

  const api = useMemo(() => {
    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
  }, []);

  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  });

  // ❌ response interceptor 없음 (중요)
  return api;
};
