import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting: boolean;
  submittingText: string;
  children: React.ReactNode;
}

export function AuthSubmitButton({
  isSubmitting,
  submittingText,
  children,
  className,
  disabled,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting || disabled}
      className={cn(
        "w-full h-12 sm:h-[54px] rounded-xl bg-[#5D6B4D] hover:bg-[#4E5A40] text-white",
        "font-medium text-sm tracking-wide transition-all duration-200 ease-out",
        "flex items-center justify-center gap-2 select-none",
        "shadow-xs hover:shadow-md active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D6B4D] focus-visible:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100",
        className
      )}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="size-4 animate-spin shrink-0" aria-hidden="true" />
          <span>{submittingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
