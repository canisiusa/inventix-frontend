"use client";

import Cookies from "js-cookie";

const COOKIE_OPTIONS = {
  expires: 7, // 7 jours
  path: "/",
  secure: true,
  sameSite: "Strict" as const,
};

/**
 * Définit les tokens d'auth dans les cookies (1 ou les 2)
 */
export function setAuthTokens(tokens: {
  accessToken?: string;
  refreshToken?: string;
}) {
  if (tokens.accessToken) {
    Cookies.set("accessToken", tokens.accessToken, COOKIE_OPTIONS);
  }

  if (tokens.refreshToken) {
    Cookies.set("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
  }
}

/**
 * Récupère les tokens stockés dans les cookies
 */
export function getAuthTokens(): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  return {
    accessToken: Cookies.get("accessToken") || null,
    refreshToken: Cookies.get("refreshToken") || null,
  };
}

/**
 * Supprime les tokens (1 ou les 2)
 */
export function deleteAuthTokens(options?: {
  accessToken?: boolean;
  refreshToken?: boolean;
}) {
  if (options?.accessToken ?? true) {
    Cookies.remove("accessToken", { path: "/" });
  }

  if (options?.refreshToken ?? true) {
    Cookies.remove("refreshToken", { path: "/" });
  }
}
