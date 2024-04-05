import Shipstation from "shipstation-node";
import type { IOrderPaginationResult } from "shipstation-node/typings/models";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

const credentials = {
  key: process.env.VERCEL_SHIPSTATION_KEY,
  secret: process.env.VERCEL_SHIPSTATION_SECRET,
};

const shipStation = new Shipstation({
  apiKey: credentials.key,
  apiSecret: credentials.secret,
});

const getOrderList = async (
  client: Shipstation,
  opts: object,
): Promise<IOrderPaginationResult | null> => {
  try {
    const orderList = await client.orders.getAll(opts);
    console.log("Order List: " + JSON.stringify(orderList));
    return orderList;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function POST(request: Request) {
 
  try { 
        if (!request.body) {
        return new Response("Request body is required", { status: 400 });
      }
      const { orderNumber } = await request.json();
      const orders = await getOrderList(shipStation, orderNumber);
      return new Response(`Hello from ${process.env.VERCEL_REGION}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    else {
      console.log("Error: " + error); 
    }
  } 
} 
