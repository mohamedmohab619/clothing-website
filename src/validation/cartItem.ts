import z from "zod";

export const cartItemUISchema = z.object({
  productId: z.number().min(1),
  title: z.string(),
  price: z.number(),
  image: z.string(),
  variantId: z.number(),
  variant: z.object({
    colorName: z.string(),
    size: z.string(),
    price: z.number(),
    product: z.object({
      name: z.string(),
    })
  }),
  quantity: z.number().min(1),
  selectedColor: z.string(),
  selectedSize: z.string(),
});

export type TCartItemUISchema = z.infer<typeof cartItemUISchema>;
