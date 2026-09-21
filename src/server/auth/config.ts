import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/utils";
import db from "@/server/db";
import { Role } from "@/lib/types";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    // verifyRequest: not used for credentials
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = db
          .prepare(
            `SELECT id, email, first_name, last_name, password_hash, role, suspended FROM users WHERE email = ?`,
          )
          .get(credentials.email.toLowerCase()) as
          | {
              id: string;
              email: string;
              first_name: string | null;
              last_name: string | null;
              password_hash: string | null;
              role: Role;
              suspended: number;
            }
          | undefined;
        if (!user || !user.password_hash) return null;
        if (user.suspended) return null;
        const ok = await verifyPassword(credentials.password, user.password_hash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role;
        (token as any).firstName = (user as any).firstName;
        (token as any).lastName = (user as any).lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id;
        (session.user as any).role = (token as any).role;
        (session.user as any).firstName = (token as any).firstName;
        (session.user as any).lastName = (token as any).lastName;
      }
      return session;
    },
  },
};
