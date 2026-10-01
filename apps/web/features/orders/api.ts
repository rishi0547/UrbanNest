import { createClient } from "@/lib/supabase/client";
import type { Order } from "./types";

function getSupabase(client?: any) {
  return client || createClient();
}

export function normalizeOrder(raw: any): Order {
  if (!raw) return raw;
  const items = (raw.order_items || []).map((item: any) => {
    const itemPrice = Number(item.product_price ?? item.price ?? 0);
    const quantity = Number(item.quantity ?? 1);
    const lineTotal = Number(
      item.line_total ?? itemPrice * quantity
    );

    return {
      ...item,
      product_name:
        item.product_name || item.product?.title || "UrbanNest Item",
      product_price: itemPrice,
      quantity,
      line_total: lineTotal,
      price: itemPrice,
    };
  });

  const total = Number(raw.total ?? raw.total_amount ?? 0);
  const subtotal = Number(
    raw.subtotal ??
      (items.reduce((s: number, i: any) => s + (i.line_total || 0), 0) || total)
  );
  // Free delivery over ₹9,999, flat delivery ₹999 otherwise
  const shipping = Number(
    raw.shipping ?? (subtotal >= 9999 || subtotal === 0 ? 0 : 999)
  );
  const tax = Number(raw.tax ?? Math.round(subtotal * 0.08));

  return {
    ...raw,
    subtotal,
    shipping,
    tax,
    total: total || Math.round(subtotal + shipping + tax),
    total_amount: total || Math.round(subtotal + shipping + tax),
    order_items: items,
  };
}

/**
 * Fetch orders belonging to the authenticated customer.
 */
export async function getUserOrders(client?: any, userId?: string): Promise<Order[]> {
  const supabase = getSupabase(client);

  let query = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      user_id,
      status,
      total_amount,
      shipping_address,
      created_at,
      updated_at,
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price,
        created_at,
        product:products (
          id,
          title,
          slug,
          images
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "Error fetching user orders:",
      error.message || error.code || JSON.stringify(error)
    );
    return [];
  }

  return (data || []).map(normalizeOrder);
}

/**
 * Fetch all orders across all customers (admin only).
 */
export async function getAdminOrders(client?: any): Promise<Order[]> {
  const supabase = getSupabase(client);

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      user_id,
      status,
      total_amount,
      shipping_address,
      created_at,
      updated_at,
      profile:profiles (
        id,
        email,
        full_name
      ),
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price,
        created_at,
        product:products (
          id,
          title,
          slug,
          images
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "Error fetching admin orders:",
      error.message || error.code || JSON.stringify(error)
    );
    return [];
  }

  return (data || []).map(normalizeOrder);
}

/**
 * Fetch a single order by its UUID ID.
 */
export async function getOrderById(
  orderId: string,
  client?: any
): Promise<Order | null> {
  const supabase = getSupabase(client);

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      user_id,
      status,
      total_amount,
      shipping_address,
      created_at,
      updated_at,
      profile:profiles (
        id,
        email,
        full_name
      ),
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price,
        created_at,
        product:products (
          id,
          title,
          slug,
          images
        )
      )
    `)
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return normalizeOrder(data);
}
