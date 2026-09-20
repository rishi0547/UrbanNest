"use client";

import { useQuery } from "@tanstack/react-query";
import { orderQueryKeys } from "./query-keys";
import { getUserOrders, getAdminOrders, getOrderById } from "./api";

/**
 * Hook to retrieve authenticated customer's orders with TanStack Query caching.
 */
export function useUserOrders() {
  return useQuery({
    queryKey: orderQueryKeys.user(),
    queryFn: () => getUserOrders(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to retrieve all system orders for admin management.
 */
export function useAdminOrders() {
  return useQuery({
    queryKey: orderQueryKeys.admin(),
    queryFn: () => getAdminOrders(),
    staleTime: 15 * 1000, // 15 seconds for administrative monitoring
  });
}

/**
 * Hook to retrieve order details by orderId.
 */
export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: Boolean(orderId),
  });
}
