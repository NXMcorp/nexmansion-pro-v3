"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-charcoal hover:bg-sand transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
