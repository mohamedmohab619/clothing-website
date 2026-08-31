import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  pgEnum,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// define timestamps and import them in every table
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

// Enum for product status
export const productStatusEnum = pgEnum('product_status', ['draft', 'active', 'archived'])

export const products = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  status: productStatusEnum().default('draft').notNull(),
  ...timestamps
});

export const variants = pgTable('variants', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  sku: varchar({ length: 100 }).notNull().unique(),
  price: integer().notNull(),
  comparePrice: integer('compare_price'),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  colorName: varchar('color_name', { length: 50 }).notNull(),
  colorValue: varchar('color_value', { length: 50 }).notNull(),
  size: varchar('size', { length: 20 }).notNull(),
  weightGrams: integer('weight_grams'),
  ...timestamps
});

export const productImages = pgTable('product_images', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  colorName: varchar('color_name', { length: 50 }).notNull(),
  imageUrl: varchar('image_url', { length: 508 }).notNull(),
  isPrimary: boolean('is_primary').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  ...timestamps
});

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(variants),
  images: many(productImages),
}));

export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));
