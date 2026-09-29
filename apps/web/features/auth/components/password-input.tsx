import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
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
            type={showPassword ? "text" : "password"}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full h-12 sm:h-[54px] pl-4 sm:pl-4.5 pr-12 rounded-xl bg-white border border-[#E5E2DC] text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF]",
              "transition-all duration-200 ease-out outline-none",
              "focus:border-[#5D6B4D] focus:ring-2 focus:ring-[#5D6B4D]/20",
              "hover:border-[#D4C5A9]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F0EDE8]/50",
              error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1A1A1A] p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D6B4D]"
          >
            {showPassword ? (
              <EyeOff className="size-4.5" aria-hidden="true" />
            ) : (
              <Eye className="size-4.5" aria-hidden="true" />
            )}
          </button>
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

PasswordInput.displayName = "PasswordInput";
