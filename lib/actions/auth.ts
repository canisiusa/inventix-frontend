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
    const url = `${apiSuffix}/auth/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw responseData;
    }


    return {
      data: responseData,
      status: "success",
    };
  } catch (error: any) {
    return {
      status: "failure",
      data: error,
    };
  }
};


export const confirmEmail = async (data: {token:string, email:string}) => {
  try {
    const url = `${apiSuffix}/auth/confirm-email`;

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
      data: "Email confirmé avec succès",
      status: "success",
    };
  } catch(error) {
    console.log(error);
    return {
      status: "failure",
      data: "Une erreur est survenue lors de la confirmation",
    };
  }
};

export const resendConfirmationEmail = async (email:string) => {
  try {
    const url = `${apiSuffix}/auth/resend-confirm-email`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email}),
    });
    const responseData = await response.json();

    if (!response.ok) {
      return {
        status: "failure",
        data: responseData
      };
    }

    return {
      data: "Email de confirmation envoyé",
      status: "success",
    };
  } catch(error) {
    console.log(error);
    return {
      status: "failure",
      data: "Une erreur est survenue lors de l'envoi",
    };
  }
};

export const sendResetPwdEmail = async (data: {email:string}) => {
  try {
    const url = `${apiSuffix}/auth/send-reset-password-email`;

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
      data: "Email de confirmation envoyé",
      status: "success",
    };
  } catch {
    return {
      status: "failure",
      data: "Une erreur est survenue lors de l'envoi",
    };
  }
};


export const sendResetPwd = async (data: {
  password: string;
  confirmPassword: string;
  token: string | null;
  email: string | null;
}) => {
  try {
    const url = `${apiSuffix}/auth/reset-password`;

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
      data: "Email de confirmation envoyé",
      status: "success",
    };
  } catch {
    return {
      status: "failure",
      data: "Une erreur est survenue lors de l'envoi",
    };
  }
};