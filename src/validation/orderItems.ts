import { orderItems } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const orderItemSelectSchema = createSelectSchema(orderItems);
export type orderItemSelect = z.infer<typeof orderItemSelectSchema>;

export const orderItemInsertSchema = createInsertSchema(orderItems);
export type orderItemInsert = z.infer<typeof orderItemInsertSchema>;

