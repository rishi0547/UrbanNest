import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In | UrbanNest",
  description: "Sign in to your UrbanNest customer account",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[85vh] items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
