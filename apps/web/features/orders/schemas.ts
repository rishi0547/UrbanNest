import { z } from "zod";

export const shippingAddressSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number cannot exceed 20 characters")
    .regex(/^[+0-9\s\-()]+$/, "Please enter a valid phone number"),
  address: z
    .string()
    .trim()
    .min(5, "Street address must be at least 5 characters")
    .max(250, "Address is too long"),
  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City name is too long"),
  state: z
    .string()
    .trim()
    .min(2, "State or Province is required")
    .max(100, "State name is too long"),
  pincode: z
    .string()
    .trim()
    .min(3, "Postal code/pincode is required")
    .max(12, "Postal code is too long"),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const checkoutItemSchema = z.object({
  productId: z.string().uuid("Invalid product identifier"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const checkoutOrderSchema = z.object({
  shipping: shippingAddressSchema,
  items: z
    .array(checkoutItemSchema)
    .min(1, "At least one item is required in the cart to place an order"),
});

export type CheckoutOrderInput = z.infer<typeof checkoutOrderSchema>;
