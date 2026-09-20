/**
 * TanStack Query Key Factory for Orders.
 * Enables granular cache invalidation when orders are created or statuses are updated.
 */
export const orderQueryKeys = {
  all: ["orders"] as const,
  user: () => [...orderQueryKeys.all, "user"] as const,
  admin: () => [...orderQueryKeys.all, "admin"] as const,
  detail: (orderId: string) => [...orderQueryKeys.all, "detail", orderId] as const,
};
