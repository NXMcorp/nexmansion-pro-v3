import { HostShell } from "@/components/host/HostShell";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { NewPropertyForm } from "@/components/host/NewPropertyForm";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <HostShell active="properties">
      <p className="label-gold mb-4">New property</p>
      <h1 className="font-serif text-4xl text-midnight mb-8">List a villa</h1>
      <div className="bg-white border border-midnight/10 p-6 md:p-8 max-w-2xl">
        <p className="text-sm text-charcoal/70 mb-6">After submission, NexMansion reviews every property before publication. A member of our Bali team may visit the property before approval.</p>
        <NewPropertyForm />
      </div>
    </HostShell>
  );
}
