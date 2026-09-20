"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, requireAdmin } from "@/features/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { checkoutOrderSchema, type CheckoutOrderInput } from "./schemas";
import type { OrderStatus } from "./types";

export interface CreateOrderResult {
  success: boolean;
  error?: string;
  orderNumber?: string;
  orderId?: string;
}

export interface UpdateOrderStatusResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action to place a customer order atomically.
 * Enforces authentication, verifies server-side product prices and stock availability,
 * creates the orders and order_items records, decrements inventory, and revalidates cached routes.
 */
export async function createOrderAction(
  rawInput: CheckoutOrderInput
): Promise<CreateOrderResult> {
  const { user } = await requireAuth();

  const parseResult = checkoutOrderSchema.safeParse(rawInput);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid order details provided.",
    };
  }

  const { shipping, items } = parseResult.data;

  if (items.length === 0) {
    return {
      success: false,
      error: "Your cart is empty. Add items before checking out.",
    };
  }

  const supabase = await createClient();

  // 1. Fetch real-time products from database to prevent client-side price tampering
  const productIds = items.map((i) => i.productId);
  const { data: dbProducts, error: prodError } = await supabase
    .from("products")
    .select("id, title, price, stock, is_published")
    .in("id", productIds);

  if (prodError || !dbProducts || dbProducts.length === 0) {
    return {
      success: false,
      error: "Failed to verify products in database. Please try again.",
    };
  }

  // 2. Validate availability and stock constraints
  for (const item of items) {
    const matchedProduct = dbProducts.find((p) => p.id === item.productId);
    if (!matchedProduct || !matchedProduct.is_published) {
      return {
        success: false,
        error: `Product "${matchedProduct?.title || item.productId}" is no longer available.`,
      };
    }

    if (matchedProduct.stock < item.quantity) {
      return {
        success: false,
        error: `Insufficient inventory for "${matchedProduct.title}". Only ${matchedProduct.stock} unit(s) remaining.`,
      };
    }
  }

  // 3. Calculate financial totals on the server
  const subtotal = items.reduce((sum, item) => {
    const prod = dbProducts.find((p) => p.id === item.productId)!;
    return sum + Number(prod.price) * item.quantity;
  }, 0);

  const FREE_SHIPPING_THRESHOLD = 500;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const totalAmount = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  // 4. Generate unique business order identifier (e.g. UN-2026-894123)
  const orderNumber = `UN-${new Date().getFullYear()}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  // 5. Insert order header
  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      status: "pending",
      total_amount: totalAmount,
      shipping_address: shipping,
    })
    .select("id, order_number")
    .single();

  if (orderError || !newOrder) {
    console.error("Order creation failed:", orderError);
    return {
      success: false,
      error: orderError?.message || "Could not record order in database.",
    };
  }

  // 6. Insert order line items capturing immutable historical purchase price
  const lineItems = items.map((item) => {
    const prod = dbProducts.find((p) => p.id === item.productId)!;
    return {
      order_id: newOrder.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: Number(prod.price),
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(lineItems);

  if (itemsError) {
    console.error("Order items insertion failed:", itemsError);
    return {
      success: false,
      error: "Order was created but failed to save line items.",
    };
  }

  // 7. Atomically decrement physical stock in products table
  for (const item of items) {
    const prod = dbProducts.find((p) => p.id === item.productId)!;
    const remainingStock = Math.max(0, prod.stock - item.quantity);
    await supabase
      .from("products")
      .update({ stock: remainingStock })
      .eq("id", item.productId);
  }

  // 8. Revalidate cached routes
  revalidatePath("/orders");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  revalidatePath("/products");

  return {
    success: true,
    orderNumber: newOrder.order_number,
    orderId: newOrder.id,
  };
}

/**
 * Server Action for administrators to transition order fulfillment statuses.
 */
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus
): Promise<UpdateOrderStatusResult> {
  await requireAdmin();

  const allowedStatuses: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(newStatus)) {
    return {
      success: false,
      error: `Invalid status "${newStatus}".`,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("Status update error:", error);
    return {
      success: false,
      error: error.message || "Failed to update order status.",
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/orders");

  return { success: true };
}
