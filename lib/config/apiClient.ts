/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { getSession, signIn, signOut } from "next-auth/react";

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
    const session = await getSession();

    if (session && session.backendTokens.accessToken) {
      config.headers.Authorization = `Bearer ${session.backendTokens.accessToken}`;
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

      const session = await getSession();

      if (!session || !session.backendTokens.refreshToken) {
        await signOut();

        return Promise.reject(error);
      }

      try {
        const response = await axios.post("/api/auth/refresh", {
          refreshToken: session.backendTokens.refreshToken,
        });

        const newToken = response.data.accessToken;

        // Mettre à jour le token dans la session
        await signIn("credentials", {
          redirect: false,
          accessToken: newToken,
          refreshToken: session.backendTokens.refreshToken,
        });

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
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
