import * as React from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/features/auth/roles";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  title: {
    default: "Admin Console | UrbanNest",
    template: "%s | UrbanNest Admin",
  },
  description: "Executive operations, inventory, and order fulfillment control system.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireAdmin("/admin");

  const adminEmail = profile?.email || user.email;
  const adminName = profile?.full_name || "Operations Lead";

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A] selection:bg-[#5D6B4D]/20 selection:text-[#1A1A1A]">
      <AdminHeader adminEmail={adminEmail} adminName={adminName} />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
