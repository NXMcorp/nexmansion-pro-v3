import { NextResponse } from "next/server";
import db from "@/server/db";
import { getSession } from "@/server/auth/session";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = db.prepare(`SELECT property_id FROM bookings WHERE id=? AND user_id=?`).get(params.id, session.user.id) as any;
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const services = db.prepare(`SELECT * FROM services WHERE property_id=? AND active=1 ORDER BY category, name`).all(b.property_id);
  return NextResponse.json({ services });
}
