import xss from "xss";
import z from "zod";

export const cartItemServerSchema = z.object({
  productId: z.number().min(1),
  quantity: z.number().min(1),
  selectedColor: z.string().transform(f => xss(f)),
  selectedSize: z.string().transform(f => xss(f)),
  image: z.string().transform(f => xss(f)),
});
