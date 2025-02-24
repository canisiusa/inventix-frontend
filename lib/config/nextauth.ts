/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

const apiSuffix = process.env.NEXT_PUBLIC_API_URL;

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
          const loginResponse = await fetch(`${apiSuffix}/v1/users/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (loginResponse.status !== 200) {
            console.log("Login failed:", await loginResponse.json());

            return null;
          }

          const backendTokens = await loginResponse.json();

          // Fetch user info
          const userResponse = await fetch(`${apiSuffix}/users/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${backendTokens.token}`,
            },
          });

          if (userResponse.status !== 201) {
            console.log("Get user failed:", await userResponse.json());

            return null;
          }

          const user = await userResponse.json();

          return {
            user,
            backendTokens: {
              accessToken: backendTokens.token,
              refreshToken: backendTokens.refreshToken,
              expiresAt: backendTokens.number,
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
    signIn: "/",
    newUser: "/",
    signOut: "/",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return user as any;
      }

      return token;
    },

    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

