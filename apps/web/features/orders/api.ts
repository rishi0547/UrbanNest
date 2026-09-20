import { createClient } from "@/lib/supabase/client";
import type { Order } from "./types";

function getSupabase(client?: any) {
  return client || createClient();
}

/**
 * Fetch orders belonging to the authenticated customer.
 */
export async function getUserOrders(client?: any): Promise<Order[]> {
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
    console.error("Error fetching user orders:", error);
    return [];
  }

  return (data || []) as unknown as Order[];
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
    console.error("Error fetching admin orders:", error);
    return [];
  }

  return (data || []) as unknown as Order[];
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

  return data as unknown as Order;
}
