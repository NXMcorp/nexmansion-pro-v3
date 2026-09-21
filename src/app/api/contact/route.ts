import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/server/db";
import { cuid } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    subject: z.string().max(200).optional(),
    message: z.string().min(5).max(4000),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  db.prepare(`INSERT INTO contact_requests (id,name,email,subject,message) VALUES (?,?,?,?,?)`).run(
    cuid(), parsed.data.name, parsed.data.email, parsed.data.subject || null, parsed.data.message
  );
  return NextResponse.json({ ok: true });
}
