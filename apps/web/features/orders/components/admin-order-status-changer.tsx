"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { updateOrderStatusAction } from "../actions";
import type { OrderStatus } from "../types";
import { Button } from "@/components/ui/button";

interface AdminOrderStatusChangerProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function AdminOrderStatusChanger({
  orderId,
  currentStatus,
}: AdminOrderStatusChangerProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleUpdate = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, selectedStatus);
      if (res.success) {
        setStatusMessage({ text: "Fulfillment state updated successfully." });
        router.refresh();
      } else {
        setStatusMessage({ text: res.error || "Failed to update status.", error: true });
      }
    });
  };

  const hasChanged = selectedStatus !== currentStatus;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="order-status-select" className="text-xs font-semibold text-[#1A1A1A]">
          Update Fulfillment Stage
        </label>
        <select
          id="order-status-select"
          value={selectedStatus}
          disabled={isPending}
          onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
          className="w-full h-10 px-3 rounded-lg border border-[#E5E2DC] bg-white text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#5D6B4D] cursor-pointer shadow-2xs"
        >
          <option value="pending">Pending (Reviewing Order)</option>
          <option value="processing">Processing (Crating &amp; Quality Check)</option>
          <option value="shipped">Shipped (Dispatched with Freight Courier)</option>
          <option value="delivered">Delivered (White-Glove Handoff Complete)</option>
          <option value="cancelled">Cancelled (Voided &amp; Refunded)</option>
        </select>
      </div>

      <Button
        type="button"
        disabled={!hasChanged || isPending}
        onClick={handleUpdate}
        className="w-full h-9 rounded-lg bg-[#5D6B4D] hover:bg-[#4E5A40] text-white text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        {isPending ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Updating Status...</span>
          </>
        ) : (
          <>
            <Check className="size-3.5" />
            <span>Apply Status Change</span>
          </>
        )}
      </Button>

      {statusMessage && (
        <div
          className={`p-2.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 ${
            statusMessage.error
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {statusMessage.error ? (
            <AlertCircle className="size-3.5 shrink-0" />
          ) : (
            <Check className="size-3.5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
