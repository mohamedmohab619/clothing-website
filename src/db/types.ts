import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { productImages, products, variants } from "./schema";

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type ProductWithRelations = Product & {
  variants: Variant[];
  images: ProductImage[];
};

export type Variant = InferSelectModel<typeof variants>;
export type NewVariant = InferInsertModel<typeof variants>;

export type ProductImage = InferSelectModel<typeof productImages>;
export type NewProductImage = InferInsertModel<typeof productImages>;

