import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { getSession } from "@/server/auth/session";
import { cuid } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email(),
  category: z.string().min(1),
  message: z.string().min(5).max(4000),
  propertyId: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  contactMethod: z.string().default("email"),
  occasion: z.string().optional(),
  urgency: z.string().default("normal"),
});

export async function POST(req: Request) {
  const session = await getSession();
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  db.prepare(
    `INSERT INTO concierge_requests (id,user_id,email,full_name,property_id,check_in,check_out,category,message,contact_method,occasion,urgency)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
  ).run(
    cuid(), session?.user.id || null, parsed.data.email, parsed.data.fullName,
    parsed.data.propertyId || null, parsed.data.checkIn || null, parsed.data.checkOut || null,
    parsed.data.category, parsed.data.message, parsed.data.contactMethod,
    parsed.data.occasion || null, parsed.data.urgency,
  );
  return NextResponse.json({ ok: true });
}
