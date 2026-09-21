import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { getSession } from "@/server/auth/session";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = db.prepare(`SELECT id,email,first_name,last_name,phone,country,locale,currency FROM users WHERE id=?`).get(s.user.id) as any;
  return NextResponse.json({ user: {
    firstName: user.first_name, lastName: user.last_name, email: user.email,
    phone: user.phone, country: user.country, locale: user.locale, currency: user.currency
  }});
}

export async function PATCH(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(()=>({}));
  const schema = z.object({
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    phone: z.string().max(50).optional().nullable(),
    country: z.string().max(50).optional().nullable(),
    locale: z.string().max(5).optional(),
    currency: z.string().max(3).optional(),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  db.prepare(`UPDATE users SET first_name=?, last_name=?, phone=?, country=?, locale=?, currency=?, updated_at=datetime('now') WHERE id=?`)
    .run(parsed.data.firstName, parsed.data.lastName, parsed.data.phone || null, parsed.data.country || null, parsed.data.locale, parsed.data.currency, s.user.id);
  return NextResponse.json({ ok: true });
}
