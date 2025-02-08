import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '@/lib/services/api';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
  
          try {
            const response = await authService.login({
              username: credentials.email,
              password: credentials.password,
            });
  
            if (response.data) {
              return {
                id: '1',
                email: credentials.email,
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                expiresIn: response.data.expiresIn,
              };
            }
            return null;
          } catch (error) {
            console.error('Login error:', error);
            return null;
          }
        },
      }),
    ],
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
      maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
      signIn: '/login',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.expiresIn = user.expiresIn;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user = {
            ...session.user,
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            expiresIn: token.expiresIn,
          };
        }
        return session;
      },
    },
    debug: process.env.NODE_ENV === 'development',
  };