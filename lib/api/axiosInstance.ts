/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { deleteAuthTokens, getAuthTokens, setAuthTokens } from "../authTokens";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
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

// Crée une instance Axios
export const apiClient = axios.create();

// Intercepteur de requêtes pour ajouter le token
apiClient.interceptors.request.use(
  async (config) => {
    const session = getAuthTokens();

    if (session && session.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Intercepteur de réponses pour gérer le refresh token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
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
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const session = getAuthTokens();

      if (!session || !session.refreshToken) {
        deleteAuthTokens();
        toast.error("Session expired. Please log in again.");
        await signOut();
        return Promise.reject(error);
      }

      try {
        const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.post(`${apiSuffix}/auth/refresh`, {
          refreshToken: session.refreshToken,
        });

        const newToken = response.data.accessToken;

        setAuthTokens({ accessToken: newToken });




        // Mettre à jour le token dans l'instance Axios
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        deleteAuthTokens();
        toast.error("Session expired. Please log in again.");
        await signOut(); // Si le refresh échoue, déconnecte l'utilisateur

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
