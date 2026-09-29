"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("UrbanNest Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 bg-[#F8F6F2]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E2DC] p-8 text-center shadow-xs space-y-6">
        <div className="size-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center mx-auto">
          <AlertCircle className="size-7" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold text-[#1A1A1A]">
            Something went wrong
          </h2>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            An unexpected error occurred while loading this page. Our concierge team has been notified.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-[#A3A3A3] pt-1">
              Ref: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-full px-5 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-3.5" />
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-[#E5E2DC] bg-white text-[#1A1A1A] hover:bg-[#F8F6F2] rounded-full px-5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Home className="size-3.5" />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
