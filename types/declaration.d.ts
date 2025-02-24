declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      firstname: string;
      lastname: string;
      id: string;
      phoneNumber: string;
      createdAt: Date;
      updatedAt: Date;
    };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresAt: Date;
    };
  }
}

import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: {
      email: string;
      firstname: string;
      lastname: string;
      id: string;
      phoneNumber: string;
      createdAt: Date;
      updatedAt: Date;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresAt: Date;
    };
  }
}
