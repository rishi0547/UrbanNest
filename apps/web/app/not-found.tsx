import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center p-6 bg-[#F8F6F2]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="size-16 rounded-2xl bg-[#5D6B4D]/10 border border-[#5D6B4D]/20 text-[#5D6B4D] flex items-center justify-center mx-auto">
          <Compass className="size-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#5D6B4D]">
            404 Error
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-sm mx-auto">
            The architectural living piece or collection you are seeking may have moved or is no longer available.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/products" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-full px-6 text-xs font-semibold">
              Explore Catalog
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-[#E5E2DC] bg-white text-[#1A1A1A] hover:bg-[#F8F6F2] rounded-full px-5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="size-3.5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
