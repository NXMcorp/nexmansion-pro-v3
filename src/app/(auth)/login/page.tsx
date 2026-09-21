import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div id="main-content" className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-md px-5">
        <p className="label-gold mb-4 text-center">Welcome back</p>
        <h1 className="font-serif text-4xl text-midnight mb-8 text-center">Sign in</h1>
        <Suspense fallback={<div className="h-64 skeleton" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
