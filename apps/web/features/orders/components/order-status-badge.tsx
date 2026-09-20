import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="font-semibold capitalize text-xs">
          Pending
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold capitalize text-xs"
        >
          Processing
        </Badge>
      );
    case "shipped":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold capitalize text-xs"
        >
          Shipped
        </Badge>
      );
    case "delivered":
      return (
        <Badge variant="success" className="font-semibold capitalize text-xs">
          Delivered
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive" className="font-semibold capitalize text-xs">
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
