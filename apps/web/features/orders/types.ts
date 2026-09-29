export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  // Backward compatibility aliases
  address?: string;
  pincode?: string;
}

export interface OrderItemProduct {
  id: string;
  title: string;
  slug: string;
  images: string[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  line_total: number;
  price?: number; // alias
  created_at: string;
  product?: OrderItemProduct | null;
}

export interface Order {
  id: string;
  order_number?: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  total_amount?: number; // alias
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  profile?: {
    id: string;
    email: string;
    full_name?: string | null;
  } | null;
}
