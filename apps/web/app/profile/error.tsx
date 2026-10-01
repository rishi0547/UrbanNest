"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ChevronRight } from "lucide-react";
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
      <div className="max-w-md w-full bg-white rounded-xl border border-[#E5E2DC] p-8 shadow-2xs text-center space-y-6">
        <div className="mx-auto size-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <AlertCircle className="size-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700">
            Account Information Unavailable
          </span>
          <h1 className="font-heading text-xl font-bold text-[#1A1A1A]">
            Unable to Load Profile
          </h1>
          <p className="text-xs text-[#6B7280]">
            We encountered a temporary issue while fetching your account details. Please try refreshing or return to the storefront.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-lg bg-[#5D6B4D] hover:bg-[#4E5A40] text-white text-xs font-semibold px-5 h-9 shadow-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-lg border-[#E5E2DC] bg-white text-xs font-semibold px-5 h-9 shadow-2xs hover:bg-[#F0EDE8]/50 flex items-center justify-center gap-2"
            >
              <Home className="size-3.5 text-[#6B7280]" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
