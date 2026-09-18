import { orders } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import xss from "xss";
import z from "zod";

const orderStatus = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
];

const paymentStatus = [
  'pending',
  'processing',
  'paid',
  'failed',
  'refunded',
  'partially_refunded',
];

const paymentMethod = [
  'card', // Credit / Debit card
  'cash_on_delivery', // Cash / POS on delivery
  'digital_wallet', // Apple Pay / Google Pay
  'paypal', // PayPal transfer
  'bank_transfer', // Manual wire/bank transfer
];

// orderStatus, paymentStatus, paymentMethod: omitted — drizzle-zod already generates z.enum(...) for pgEnum columns,
export const orderSelectSchema = createSelectSchema(orders, {
  orderNumber: (schema) => schema.transform((item) => xss(item)),
  customerEmail: (schema) => schema.transform((item) => xss(item)),
  customerPhone: (schema) => schema.transform((item) => xss(item)),
  // TODO: do I parse jsonb columns ?
});

export type orderSelect = z.infer<typeof orderSelectSchema>;

export const orderInsertSchema = createInsertSchema(orders, {
  orderNumber: (schema) => schema.transform((item) => xss(item)),
  customerEmail: (schema) => schema.transform((item) => xss(item)),
  customerPhone: (schema) => schema.transform((item) => xss(item)),
});

export type orderInsert = z.infer<typeof orderInsertSchema>;
