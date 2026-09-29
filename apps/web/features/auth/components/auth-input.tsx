import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, label, error, hint, id, type = "text", ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-2 text-left">
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]"
          >
            {label}
          </label>
          {hint && <span className="text-[11px] text-[#6B7280]">{hint}</span>}
        </div>

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={type}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full h-12 sm:h-[54px] px-4 sm:px-4.5 rounded-xl bg-white border border-[#E5E2DC] text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF]",
              "transition-all duration-200 ease-out outline-none",
              "focus:border-[#5D6B4D] focus:ring-2 focus:ring-[#5D6B4D]/20",
              "hover:border-[#D4C5A9]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F0EDE8]/50",
              error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p id={errorId} className="text-xs text-red-600 font-medium tracking-tight mt-1.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
