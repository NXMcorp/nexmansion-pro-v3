import { redirect } from "next/navigation";
import { HostShell } from "@/components/host/HostShell";
export const dynamic = "force-dynamic";
export default function HostMessages() {
  return (
    <HostShell active="messages">
      <p className="label-gold mb-4">Messages</p>
      <h1 className="font-serif text-4xl text-midnight mb-6">Guest conversations</h1>
      <p className="text-charcoal/70 text-sm">Guest and concierge conversations will appear here once bookings are created.</p>
    </HostShell>
  );
}
