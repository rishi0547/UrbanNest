"use client";

import * as React from "react";
import { logoutAction } from "../actions";
import { Button } from "@/components/ui/button";

export function LogoutButton({
  variant = "outline",
  className,
}: {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  className?: string;
}) {
  const [isPending, startTransition] = React.useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
