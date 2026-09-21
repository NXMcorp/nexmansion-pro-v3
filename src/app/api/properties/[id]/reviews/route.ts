import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { getSession } from "@/server/auth/session";
import { cuid } from "@/lib/utils";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });
  const body = await req.json().catch(()=>({}));
  const schema = z.object({
    rating: z.coerce.number().int().min(1).max(5),
    title: z.string().max(200).optional(),
    body: z.string().min(20).max(2000),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please provide a rating and at least 20 characters of feedback." }, { status: 400 });

  // Only guests with a completed booking for this property may review
  const eligible = db.prepare(
    `SELECT b.id FROM bookings b
     WHERE b.property_id=? AND b.user_id=? AND b.status='COMPLETED'
     AND NOT EXISTS (SELECT 1 FROM reviews rv WHERE rv.booking_id=b.id)`
  ).get(params.id, session.user.id) as { id: string } | undefined;
  if (!eligible) return NextResponse.json({ error: "Only guests with a completed stay may review this property" }, { status: 403 });

  db.prepare(
    `INSERT INTO reviews (id,booking_id,property_id,user_id,rating,title,body) VALUES (?,?,?,?,?,?,?)`
  ).run(cuid(), eligible.id, params.id, session.user.id, parsed.data.rating, parsed.data.title || null, parsed.data.body);
  return NextResponse.json({ ok: true });
}
