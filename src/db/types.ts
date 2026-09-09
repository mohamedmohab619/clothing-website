import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { collections, productCollections, productImages, products, variants } from "./schema";

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type ProductWithRelations = Product & {
  variants: Variant[];
  images: ProductImage[];
  collections: ProductCollection[];
};

export type Variant = InferSelectModel<typeof variants>;
export type NewVariant = InferInsertModel<typeof variants>;

export type ProductImage = InferSelectModel<typeof productImages>;
export type NewProductImage = InferInsertModel<typeof productImages>;

export type Collection = InferSelectModel<typeof collections>;
export type NewCollection = InferInsertModel<typeof collections>;

export type ProductCollection = InferSelectModel<typeof productCollections>;
export type NewProductCollection = InferInsertModel<typeof productCollections>;
