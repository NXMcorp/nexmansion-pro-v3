import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { hashPassword, cuid } from "@/lib/utils";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(["TRAVELLER", "HOST"]).default("TRAVELLER"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { email, password, firstName, lastName, role } = parsed.data;

  const existing = db.prepare(`SELECT id FROM users WHERE email=?`).get(email.toLowerCase());
  if (existing) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

  const hash = await hashPassword(password);
  const userId = cuid();
  db.prepare(
    `INSERT INTO users (id,email,first_name,last_name,password_hash,role,email_verified) VALUES (?,?,?,?,?,?,datetime('now'))`
  ).run(userId, email.toLowerCase(), firstName, lastName, hash, role);

  if (role === "HOST") {
    db.prepare(
      `INSERT INTO host_profiles (id,user_id,verification_status) VALUES (?,?,?)`
    ).run(cuid(), userId, "unverified");
  }

  return NextResponse.json({ ok: true });
}
