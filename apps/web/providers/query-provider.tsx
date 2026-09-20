"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Global QueryClientProvider wrapper for Next.js App Router client components.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Uses getQueryClient() to guarantee a single stable client instance on the browser
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
