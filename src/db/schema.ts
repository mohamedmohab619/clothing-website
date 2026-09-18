import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  pgEnum,
  timestamp,
  primaryKey,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// define timestamps and import them in every table
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

// [______ Product _______]
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
  collections: many(productCollections),
}));

export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  images: many(productImages),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

// [______ About Product ______]
export const collections = pgTable('collections', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  imageUrl: varchar("image_url", { length: 500 }),
  ...timestamps
});

export const productCollections = pgTable('product_collections', {
  productId: integer('product_id').notNull(),
  collectionId: integer('collection_id').notNull(),
  ...timestamps
}, (table) => [
  primaryKey({ columns: [table.productId, table.collectionId] })
]);

export const collectionRelations = relations(collections, ({ many }) => ({
  productCollections: many(productCollections),
}));

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  product: one(products, {
    fields: [productCollections.productId],
    references: [products.id]
  }),
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id]
  }),
}));

// [______ Orders System ______]
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'paid',
  'failed',
  'refunded',
  'partially_refunded',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'card', // Credit / Debit card
  'cash_on_delivery', // Cash / POS on delivery
  'digital_wallet', // Apple Pay / Google Pay
  'paypal', // PayPal transfer
  'bank_transfer', // Manual wire/bank transfer
]);

export const orders = pgTable('orders', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),

  customerName: varchar('customer_name', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }),

  // userId: integer('user_id').references(() => users.id, {
  //   onDelete: 'set null',
  // }),

  // Financial columns (cents)
  subtotal: integer('subtotal').notNull(),
  shippingFee: integer('shipping_fee').default(0).notNull(),
  tax: integer('tax').default(0).notNull(),
  total: integer('total').notNull(),

  // Statuses
  orderStatus: orderStatusEnum('order_status').default('pending').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('pending').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),

  // Address Snapshots
  shippingAddress: jsonb('shipping_address').$type<Record<string, unknown>>().notNull(),
  billingAddress: jsonb('billing_address').$type<Record<string, unknown>>(),

  // Timestamps
  ...timestamps
});

// --- Order Items Table ---
export const orderItems = pgTable('order_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id').notNull().references(() => orders.id, {
    onDelete: 'cascade'
  }),

  variantId: integer('variant_id').references(() => variants.id, {
    onDelete: 'set null',
  }),

  // Historical Snapshot Data
  productName: varchar('product_name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  size: varchar('size', { length: 20 }).notNull(),
  unitPrice: integer('unit_price').notNull(),
  quantity: integer('quantity').notNull(),

  // Timestamps
  ...timestamps
});

// --- Drizzle Relations API Definitions ---
export const ordersRelations = relations(orders, ({ one, many }) => ({
  // user: one(users, {
  //   fields: [orders.userId],
  //   references: [users.id],
  // }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(variants, {
    fields: [orderItems.variantId],
    references: [variants.id],
  }),
}));
