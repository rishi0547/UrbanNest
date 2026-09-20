import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create Account | UrbanNest",
  description: "Create an account with UrbanNest to save designs and place orders",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-[85vh] items-center justify-center p-4">
      <RegisterForm />
    </main>
  );
}
