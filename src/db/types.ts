import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  products,
  variants,
  productImages,
  collections,
  productCollections,
  orders,
  orderItems,
} from "./schema";

// [______ Product _______]
export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type ProductWithRelations = Product & {
  variants: Variant[];
  images: ProductImage[];
  collections?: ProductCollectionWithRelations[];
};

export type Variant = InferSelectModel<typeof variants>;
export type NewVariant = InferInsertModel<typeof variants>;

export type ProductImage = InferSelectModel<typeof productImages>;
export type NewProductImage = InferInsertModel<typeof productImages>;

// [______ About Product ______]
export type Collection = InferSelectModel<typeof collections>;
export type NewCollection = InferInsertModel<typeof collections>;

export type ProductCollection = InferSelectModel<typeof productCollections>;
export type NewProductCollection = InferInsertModel<typeof productCollections>;

export type ProductCollectionWithRelations = ProductCollection & { collection?: Collection; }

// [______ Orders System ______]
export type Order = InferSelectModel<typeof orders>
export type NewOrder = InferInsertModel<typeof orders>

export type OrderItem = InferSelectModel<typeof orderItems>
export type NewOrderItem = InferInsertModel<typeof orderItems>
