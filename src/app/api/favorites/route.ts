import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { getSession } from "@/server/auth/session";
import { cuid } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ favorites: [] });
  const rows = db.prepare(`SELECT property_id FROM favorites WHERE user_id=?`).all(session.user.id) as { property_id: string }[];
  return NextResponse.json({ favorites: rows.map(r => r.property_id) });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { propertyId } = z.object({ propertyId: z.string() }).parse(body);
  const exists = db.prepare(`SELECT id FROM favorites WHERE user_id=? AND property_id=?`).get(session.user.id, propertyId);
  if (!exists) {
    db.prepare(`INSERT INTO favorites (id,user_id,property_id) VALUES (?,?,?)`).run(cuid(), session.user.id, propertyId);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get("propertyId") || (await req.json().catch(()=>({}))).propertyId;
  if (!propertyId) return NextResponse.json({ error: "propertyId required" }, { status: 400 });
  db.prepare(`DELETE FROM favorites WHERE user_id=? AND property_id=?`).run(session.user.id, propertyId);
  return NextResponse.json({ ok: true });
}
