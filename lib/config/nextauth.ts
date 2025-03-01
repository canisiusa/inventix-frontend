/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

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
            console.log("Login failed:", backendTokens);

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

          const user = await userResponse.json();

          if (!userResponse.ok) {
            console.log("Get user failed:", user);
            return null;
          }


          return {
            user,
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

