import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "customer";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

/**
 * Retrieves the current authenticated user and their profile record.
 * Returns null if the user is unauthenticated or profile is missing.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile: profile as UserProfile | null,
    role: ((profile as UserProfile | null)?.role ?? "customer") as UserRole,
  };
}

/**
 * Returns true if the user is authenticated and holds the 'admin' role.
 */
export async function isAdmin(): Promise<boolean> {
  const current = await getCurrentUser();
  return current?.role === "admin";
}

/**
 * Returns true if a user session is active.
 */
export async function isCustomer(): Promise<boolean> {
  const current = await getCurrentUser();
  return current !== null;
}

/**
 * Guard: Enforces authentication.
 * Redirects unauthenticated visitors to /login.
 */
export async function requireAuth(redirectTo?: string) {
  const current = await getCurrentUser();
  if (!current?.user) {
    const target = redirectTo
      ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : "/login";
    redirect(target);
  }
  return current;
}

/**
 * Guard: Enforces admin authorization.
 * If unauthenticated -> redirects to /login?redirectTo=...
 * If authenticated but non-admin -> redirects to / (home)
 */
export async function requireAdmin(redirectTo: string = "/admin") {
  const current = await getCurrentUser();

  if (!current?.user) {
    redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  if (current.role !== "admin") {
    redirect("/");
  }

  return current;
}
