import { cookies } from "next/headers";

export const saveAccessToken = async (accessToken: string) => {
  const cookie = await cookies();
  cookie.set("accessToken", accessToken);
}

export const saveRefreshToken = async (refreshToken: string) => {
  const cookie = await cookies();
  cookie.set("refreshToken", refreshToken);
}

export const getAccessToken = async () => {
  const cookie = await cookies();
  return cookie.get("accessToken");
}

export const getRefreshToken = async () => {
  const cookie = await cookies();
  return cookie.get("refreshToken");
}

export const removeTokens = async () => {
  const cookie = await cookies();
  cookie.delete("accessToken");
  cookie.delete("refreshToken");
}

export const isRefreshToken = async () => {
  const refreshToken = await getRefreshToken();
  return !!refreshToken;
}

export const isAccessToken = async () => {
  const accessToken = await getAccessToken();
  return !!accessToken;
}

export const changeLocale = async (lang: string) => {
  const cookie = await cookies();
  cookie.set("locale", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 // 24 heures
  });
}