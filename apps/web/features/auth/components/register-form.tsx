"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { registerSchema, type RegisterInput } from "../schemas";
import { registerAction } from "../actions";
import { AuthLayout } from "./auth-layout";
import { AuthInput } from "./auth-input";
import { PasswordInput } from "./password-input";
import { AuthSubmitButton } from "./auth-submit-button";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const result = await registerAction(values);
      if (!result.success) {
        setServerError(result.error ?? "Registration failed. Please check your information and try again.");
        return;
      }
      setSuccessMessage(
        "Account created! Welcome to UrbanNest. Redirecting to your profile..."
      );
      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 1200);
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=85&fit=crop"
      imageAlt="UrbanNest handcrafted furniture and architectural interior design"
      badge="MEMBER ACCESS"
      quote="Architecture begins with the home."
      subquote="Join our community of considered interior design and timeless craftsmanship."
      eyebrow="URBANNEST"
      title="Create your account"
      description="Join UrbanNest to curate your spaces and track your orders."
      footer={
        <div className="w-full">
          {/* Subtle Divider (26–32px from CTA) */}
          <div className="w-full border-t border-[#E5E2DC] my-7 sm:my-8" />

          {/* Alternate Auth Link (24–28px below divider) */}
          <p className="text-center text-xs sm:text-sm text-[#6B7280]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#1A1A1A] underline underline-offset-4 hover:text-[#5D6B4D] transition-colors"
            >
              Sign In
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

        {successMessage && (
          <div
            role="status"
            className="rounded-xl border border-[#5D6B4D]/30 bg-[#5D6B4D]/10 p-4 text-xs sm:text-sm text-[#1A1A1A] flex items-start gap-3 transition-all"
          >
            <CheckCircle2 className="size-4.5 shrink-0 text-[#5D6B4D] mt-0.5" />
            <span className="leading-relaxed font-medium">{successMessage}</span>
          </div>
        )}

        <AuthInput
          id="register-fullname"
          label="Full Name"
          type="text"
          placeholder="Eleanor Vance"
          autoComplete="name"
          disabled={isSubmitting}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <AuthInput
          id="register-email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          id="register-password"
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          id="register-confirm-password"
          label="Confirm Password"
          placeholder="••••••••"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {/* Last field → CTA: 28–32px */}
        <div className="pt-3 sm:pt-4">
          <AuthSubmitButton
            isSubmitting={isSubmitting}
            submittingText="Creating account..."
          >
            Create Account
          </AuthSubmitButton>
        </div>
      </form>
    </AuthLayout>
  );
}
