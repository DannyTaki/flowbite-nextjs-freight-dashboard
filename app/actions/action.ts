"use server";

import Shipstation from "shipstation-node";
import type { IOrderPaginationResult } from "shipstation-node/typings/models";
import { z } from "zod";

const FormData = z.object({ "order-number": z.string() });

const credentials = {
  key: process.env.VERCEL_SHIPSTATION_KEY,
  secret: process.env.VERCEL_SHIPSTATION_SECRET,
};

const shipStation = new Shipstation({
  apiKey: credentials.key,
  apiSecret: credentials.secret,
});


export async function getOrder(formData: FormData): Promise<IOrderPaginationResult | null> {
    try {
        const rawFormData = {
            orderNumber: formData.get("order-number"),
        };
        const orderList = await shipStation.orders.getAll(rawFormData);
        console.log("Order List: " + JSON.stringify(orderList));
        return orderList;
    } catch (err) {
        console.error(err);
        return null;
    }
};