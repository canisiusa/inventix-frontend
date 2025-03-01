declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      acceptTerms: boolean;
      createdAt: Date;
      updatedAt: Date;
      companiesUser: {
        id: string;
        userId: string;
        companyId: string;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
        company: {
          id: string;
          name: string;
          description: null;
          createdAt: Date;
          updatedAt: Date;
        };
        role: {
          id: string;
          name: string;
          permissions: string[];
          companyId: string;
          isOwner: boolean;
          isDefault: boolean;
          createdAt: Date;
          updatedAt: Date;
        };
      }[];
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
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      acceptTerms: boolean;
      createdAt: Date;
      updatedAt: Date;
      companiesUser: {
        id: string;
        userId: string;
        companyId: string;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
        company: {
          id: string;
          name: string;
          description: null;
          createdAt: Date;
          updatedAt: Date;
        };
        role: {
          id: string;
          name: string;
          permissions: string[];
          companyId: string;
          isOwner: boolean;
          isDefault: boolean;
          createdAt: Date;
          updatedAt: Date;
        };
      }[];
    };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
}
