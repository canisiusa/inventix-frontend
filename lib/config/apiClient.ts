"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "./nextauth";
import { cookies } from "next/headers"; // Utiliser les cookies pour stocker le token
import axios from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

// Instance Axios
export const apiClient = axios.create();

// Intercepteur de requêtes pour ajouter le token
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getServerSession(authOptions);
    if (session && session.backendTokens?.accessToken) {
      config.headers.Authorization = `Bearer ${session.backendTokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepteur de réponse pour gérer le refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getServerSession(authOptions);

        if (!session || !session.backendTokens?.refreshToken) {
          (await cookies()).delete("next-auth.session-token"); // Supprime la session en cas d'échec

          return Promise.reject(error);
        }

        const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await axios.post(`${apiSuffix}/auth/refresh`, {
          refreshToken: session.backendTokens.refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        // 🔹 Mettre à jour le cookie de session
        (await
          // 🔹 Mettre à jour le cookie de session
          cookies()).set("next-auth.session-token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
          });

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (err) {
        console.log("Refresh token failed:", err);
        processQueue(err, null);

        (await cookies()).delete("next-auth.session-token"); // Supprime la session en cas d'échec

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
