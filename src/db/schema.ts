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
  index,
  date
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// define timestamps and import them in every table
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

//🔴 [______ Auth Schema (don't touch) _______]
// filds firstName, lastName, phoneNumber, and birthdate are additonal fileds not added by better-auth
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthDate: timestamp("birth_date"),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("sessions_userId_idx").on(table.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("accounts_userId_idx").on(table.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
//🔴 [______ end of Auth Schema (don't touch) _______]

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

  userId: text('user_id').references(() => users.id, {
    onDelete: 'set null',
  }),

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
  image: varchar('image', { length: 508 }),

  // Timestamps
  ...timestamps
});

// --- Drizzle Relations API Definitions ---
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
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

// Addresses System
export const addresses = pgTable('addresses', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  country: varchar({ length: 255 }).notNull(),
  street: varchar({ length: 255 }),
  unit: varchar({ length: 255 }),
  city: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  zip: varchar({ length: 50 }),
  label: varchar({ length: 50 }), // description of the saved address (e.g. Home, work, Dad's House, etc..)
  isDefault: boolean("is_default").default(false),
  ...timestamps
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id]
  }),
}));
