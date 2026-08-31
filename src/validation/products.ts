import { products } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import xss from "xss";
import z from "zod";

// omitting status column from custom overrides, `drizzle-zod` automatically handles enum logic
export const productSelectSchema = createSelectSchema(products, {
  name: (schema) => schema.transform((item) => xss(item)),
  slug: (schema) => schema.transform((item) => xss(item)),
  description: (schema) => schema.transform((item) => xss(item)),
});

export type productSelect = z.infer<typeof productSelectSchema>;


export const productInsertSchema = createInsertSchema(products, {
  name: (schema) => schema.transform((item) => xss(item)),
  slug: (schema) => schema.transform((item) => xss(item)),
  description: (schema) => schema.transform((item) => xss(item)),
});

export type productInsert = z.infer<typeof productInsertSchema>;
