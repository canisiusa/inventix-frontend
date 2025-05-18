declare module "next-auth" {
  interface Session {
    companyUser: {
      id: string;
      name: string;
      userId: string;
      companyId: string;
      roleId: string;
      user: {
        id: string;
        email: string;
        emailVerified: boolean;
        acceptTerms: boolean;
        createdAt: Date;
        updatedAt: Date;
      }
    };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
}

import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    companyUser: {
      id: string;
      name: string;
      userId: string;
      companyId: string;
      roleId: string;
      user: {
        id: string;
        email: string;
        emailVerified: boolean;
        acceptTerms: boolean;
        createdAt: Date;
        updatedAt: Date;
      }
    };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
}
