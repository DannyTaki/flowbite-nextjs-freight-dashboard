import { get } from "http";
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

// export async function GET() {
//   return new Response("Andre Takis was here", { status: 405 });

// }

export async function POST(request: Request) {
 
  try { 
        if (!request.body) {
        return new Response("Request body is required", { status: 400 });
      }
      const { orderNumber } = await request.json();
      if (orderNumber === null || orderNumber === undefined) {
        return new Response("Order number is required", { status: 400 });
      }
      if (typeof orderNumber === "string" && orderNumber.length === 0) {
        return new Response("Order number must not be empty, and must be a string", { status: 400 });
      }
      const orders = await getOrderList(shipStation, orderNumber);
      return new Response(JSON.stringify({ orderNumber, orders }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } // Make sure to set Content-Type as application/json
      });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    else {
      console.log("Error: " + error); 
    }
  } 
} 
