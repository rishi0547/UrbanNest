"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { loginSchema, type LoginInput } from "../schemas";
import { loginAction } from "../actions";
import { AuthLayout } from "./auth-layout";
import { AuthInput } from "./auth-input";
import { PasswordInput } from "./password-input";
import { AuthSubmitButton } from "./auth-submit-button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/profile";
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      const result = await loginAction(values);
      if (!result.success) {
        setServerError(result.error ?? "Authentication failed. Please verify your credentials.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=85&fit=crop"
      imageAlt="UrbanNest architectural living room with handcrafted minimalist furniture"
      badge="ATELIER COLLECTION"
      quote="Designed for the way you live."
      subquote="Curated pieces for considered spaces."
      eyebrow="URBANNEST"
      title="Welcome back"
      description="Sign in to continue your UrbanNest experience."
      footer={
        <div className="w-full">
          {/* Subtle Divider (26–32px from CTA) */}
          <div className="w-full border-t border-[#E5E2DC] my-7 sm:my-8" />

          {/* Alternate Auth Link (24–28px below divider) */}
          <p className="text-center text-xs sm:text-sm text-[#6B7280]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#1A1A1A] underline underline-offset-4 hover:text-[#5D6B4D] transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 sm:space-y-6">
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50/90 p-4 text-xs sm:text-sm text-red-800 flex items-start gap-3 transition-all"
          >
            <AlertCircle className="size-4.5 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-relaxed">{serverError}</span>
          </div>
        )}

        <AuthInput
          id="login-email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          id="login-password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isSubmitting}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Last field → CTA: 28–32px */}
        <div className="pt-3 sm:pt-4">
          <AuthSubmitButton
            isSubmitting={isSubmitting}
            submittingText="Signing in..."
          >
            Sign In
          </AuthSubmitButton>
        </div>
      </form>
    </AuthLayout>
  );
}
