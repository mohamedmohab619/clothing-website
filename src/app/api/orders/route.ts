import { withErrorHandling } from "@/lib/http/utils";
import { variantSearchFilters } from "@/lib/variants/types";
import { createOrderItem } from "@/services/orderItems";
import { createOrder, createOrderWithItems, getOrders } from "@/services/orders";
import { getVariants } from "@/services/variants";
import { orderItemInsert, orderItemInsertSchema } from "@/validation/orderItems";
import { orderInsertSchema } from "@/validation/orders";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// TODO: GET /orders -- view all orders with there items 
export const GET = withErrorHandling(async (req: NextRequest) => {
  const data = await getOrders();

  return NextResponse.json({ success: true, count: data.length, data });
});

const initialItem = z.object({
  productId: z.number().gt(0),
  color: z.string().min(2),
  size: z.string().min(1),
  quantity: z.number().gt(0),
  image: z.string().nullable(),
});

const requestSchema = z.object({
  order: orderInsertSchema,
  items: z.array(initialItem).min(1, "Order must contain at least one item"),
});

// TODO: POST /orders -- create new order with it's items
export const POST = withErrorHandling(async (req: NextRequest) => {
  // extract request body
  const body = await req.json();
  // console.log("request body:");
  // console.log(body);
  // console.log("-------------------------------------------");

  // parse / validate
  const { order: orderData, items: itemsData } = requestSchema.parse(body);
  let correctSubTotal = 0;

  // items preprocessing
  const newItems: orderItemInsert[] = await Promise.all(
    itemsData.map(async (i) => {
      const filters: variantSearchFilters = { pid: i.productId, color: i.color, size: i.size }
      const [foundVariant] = await getVariants(filters);

      // DB pricing instead of client side pricing 
      correctSubTotal += foundVariant.price * i.quantity

      const newOrdrItem: orderItemInsert = {
        orderId: 0, // overwritten in the service
        productName: foundVariant.product.name,
        variantId: foundVariant.id,
        sku: foundVariant.sku,
        color: foundVariant.colorName,
        size: foundVariant.size,
        unitPrice: foundVariant.price,
        quantity: i.quantity,
        image: i.image
      };

      return newOrdrItem;
    })
  );

  // using DB pricing
  orderData.subtotal = correctSubTotal;
  orderData.total = correctSubTotal + (orderData.tax ?? 0) + (orderData.shippingFee ?? 0);

  const data = await createOrderWithItems(orderData, newItems);

  return NextResponse.json({
    success: true,
    message: "order created successfully",
    data
  });
});
