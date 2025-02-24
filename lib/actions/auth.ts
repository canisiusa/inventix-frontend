/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { RegisterSchema } from "../schemas/auth.schemas";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

export const signUp = async (data: RegisterSchema) => {
  try {
    const url = `${apiSuffix}/auth/signup`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    if (!response.ok) {
      return {
        status: "failure",
        data: responseData
      };
    }

    return {
      data: responseData,
      status: "success",
    };
  } catch {
    return {
      status: "failure",
      data: "An unknown error occurred",
    };
  }
};

export const signIn = async <T>(data: T) => {
  try {
    const url = `${apiSuffix}/auth/signin`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    return {
      data: responseData,
      status: "success",
    };
  } catch (error: any) {
    console.error(error.response);
    return {
      status: "failure",
      data: error?.message || "An unknown error occurred",
    };
  }
};