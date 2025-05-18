/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { saveAccessToken, saveRefreshToken } from "../cookieHelper";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const { email, password } = credentials;

          // Login request
          const loginResponse = await fetch(`${apiSuffix}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const backendTokens = await loginResponse.json();


          if (!loginResponse.ok) {
            return null;
          }


          // Fetch user info
          const userResponse = await fetch(`${apiSuffix}/user/current`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${backendTokens.accessToken}`,
            },
          });

          const companyUser = await userResponse.json();

          if (!userResponse.ok) {
            return null;
          }

          saveAccessToken(backendTokens.accessToken);
          saveRefreshToken(backendTokens.refreshToken);
          return {
            companyUser: {
              id: companyUser.id,
              name: companyUser.name,
              userId: companyUser.userId,
              companyId: companyUser.companyId,
              roleId: companyUser.roleId,
              user: companyUser.user,
              
            },
            backendTokens: {
              accessToken: backendTokens.accessToken,
              refreshToken: backendTokens.refreshToken,
            },
          } as any;
        } catch (error) {
          console.error("Error during login:", error);

          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Si un utilisateur se connecte, stocke ses tokens
      if (account && user) {
        return user as any;
      }

      // ✅ Mettre à jour les tokens après un refresh
      if (trigger === "update" && session?.backendTokens) {
        token.backendTokens = session.backendTokens;
      }

      return token;
    },

    async session({ token, session }) {
      session.companyUser = token.companyUser;
      session.backendTokens = token.backendTokens;

      return session;
    },

  },
  // secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

