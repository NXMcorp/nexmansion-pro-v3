import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { AccountShell } from "@/components/account/AccountShell";
import db from "@/server/db";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const convs = db.prepare(`
    SELECT c.*, (SELECT body FROM messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
      (SELECT COUNT(*) FROM messages m JOIN conversation_members cm ON cm.conversation_id=c.id WHERE cm.user_id=? AND m.created_at > COALESCE(cm.last_read_at, datetime(0))) AS unread
    FROM conversations c JOIN conversation_members cm ON cm.conversation_id=c.id
    WHERE cm.user_id=?
    GROUP BY c.id ORDER BY c.updated_at DESC
  `).all(session.user.id, session.user.id) as any[];
  return (
    <AccountShell active="messages">
      <p className="label-gold mb-4">Messages</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">Conversations</h1>
      {convs.length === 0 ? (
        <p className="text-charcoal/70">No messages yet. Your host and concierge conversations will appear here after booking.</p>
      ) : (
        <div className="border border-midnight/10 bg-white">
          {convs.map(c => (
            <div key={c.id} className="p-5 border-b border-midnight/10 last:border-0">
              <p className="font-serif text-midnight">{c.subject || "NexMansion Concierge"}</p>
              <p className="text-sm text-charcoal/70 line-clamp-1">{c.last_message}</p>
              {c.unread > 0 && <p className="text-xs text-gold uppercase tracking-widest mt-1">{c.unread} unread</p>}
            </div>
          ))}
        </div>
      )}
    </AccountShell>
  );
}
