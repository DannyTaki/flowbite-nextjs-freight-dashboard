"use server";

import { optsSchema } from "@/types/optsSchema";
import Shipstation from "shipstation-node";
import type { IOrderPaginationResult } from "shipstation-node/typings/models";

interface ErrorResult {
  error: {
    message: string;
  };
}

const credentials = {
  key: process.env.VERCEL_SHIPSTATION_KEY,
  secret: process.env.VERCEL_SHIPSTATION_SECRET,
};

const shipStation = new Shipstation({
  apiKey: credentials.key,
  apiSecret: credentials.secret,
});

export async function getOrder(
  opts: unknown,
): Promise<IOrderPaginationResult | null | ErrorResult> {
  try {
    // Server-side Validation
    const result = optsSchema.safeParse(opts);
    if (!result.success) {
      let errorMessage = "";
      // result.error.flatten();
      result.error.issues.forEach((issue) => {
        errorMessage = issue.message + ". ";
      });
      return {
        error: {
          message: errorMessage,
        },
      };
    }

    const orderList = await shipStation.orders.getAll(result.data);
    console.log("Order List: " + JSON.stringify(orderList));
    return orderList;
  } catch (err) {
    console.error(err);
    return null;
  }
}
