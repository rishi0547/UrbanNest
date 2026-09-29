"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Profile page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E2DC] p-8 shadow-xs text-center space-y-6">
        <div className="mx-auto size-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
          <AlertCircle className="size-7" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-xl font-bold text-[#1A1A1A]">
            Unable to Load Profile
          </h1>
          <p className="text-xs text-[#6B7280]">
            We encountered a temporary issue while fetching your profile details. Please try again or return home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-full bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold px-5 flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-3.5" />
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-full border-[#E5E2DC] text-xs font-semibold px-5 flex items-center justify-center gap-2"
            >
              <Home className="size-3.5" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
