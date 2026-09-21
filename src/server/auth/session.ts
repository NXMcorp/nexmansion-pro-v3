import { getServerSession } from "next-auth";
import { authOptions } from "./config";
import type { Role } from "@/lib/types";
import db from "@/server/db";

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: Role;
}

export interface NxSession {
  user: SessionUser;
}

export async function getSession(): Promise<NxSession | null> {
  const s = (await getServerSession(authOptions)) as unknown as NxSession | null;
  if (!s?.user) return null;
  const fresh = db
    .prepare(
      `SELECT id, email, first_name, last_name, role, suspended FROM users WHERE id = ?`,
    )
    .get(s.user.id) as { id: string; email: string; first_name: string | null; last_name: string | null; role: Role; suspended: number } | undefined;
  if (!fresh || fresh.suspended) return null;
  return {
    user: {
      id: fresh.id,
      email: fresh.email,
      firstName: fresh.first_name,
      lastName: fresh.last_name,
      role: fresh.role,
    },
  };
}

export async function requireUser(): Promise<SessionUser> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  return s.user;
}

export async function requireRole(roles: Role[]): Promise<SessionUser> {
  const u = await requireUser();
  if (!roles.includes(u.role)) throw new Error("FORBIDDEN");
  return u;
}

export async function isAdmin(): Promise<boolean> {
  const s = await getSession();
  return !!s && (s.user.role === "ADMIN" || s.user.role === "SUPPORT");
}
