import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountOverview } from "@/components/account/AccountOverview";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/account");
  return (
    <AccountShell active="overview">
      <AccountOverview userId={session.user.id} />
    </AccountShell>
  );
}
