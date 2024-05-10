
import type {
  IOrderPaginationResult,
} from "shipstation-node/typings/models";
import { getData } from "./getData";

export type EnrichedOrder = Awaited<ReturnType<typeof getEnrichedOrder>>;

export async function getEnrichedOrder(orderData: IOrderPaginationResult) {
    // Prepare to accumulate all enriched order data (get only the first order for now)
    const order = orderData.orders[0];
  
    console.log(`Processing order: ${order.orderId}`);
  
    // Array to hold enriched items for this order
    const enrichedItems = [];
  
    for (const item of order.items) {
      const itemData = await getData(item.sku);
      console.log(
        `Data for item ${item.sku} in order ${order.orderNumber}:`,
        itemData,
      );
  
      enrichedItems.push({
        ...item,
        additionalData: itemData,
      });
    }
    const enrichedOrder = {
      ...order,
      enrichedItems: enrichedItems,
    };
    return enrichedOrder;
  }