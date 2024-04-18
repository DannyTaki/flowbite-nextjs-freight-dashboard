"use server";

import { authSchema, optsSchema } from "@/types/optsSchema";
import Shipstation from "shipstation-node";
import type { IOrderPaginationResult, IOrder } from "shipstation-node/typings/models";
import type { paths, components } from "@/types/schema";
import createClient from "openapi-fetch";
import date from 'date-and-time';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/app/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { Schema } from "zod";
import { alias } from "drizzle-orm/pg-core";


type FreightProductData = Awaited<ReturnType<typeof getData>>;
async function getData(sku: string) { 
  const hardCodedSku = 'M1G-9XQ-Q4C'
  console.log('Getting data: ' + hardCodedSku)
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });
  
  const freightLinks = alias(schema.productFreightLinks, 'freightLinks');
  const freightClass = alias(schema.freightClassifications, 'freightClass')
  const product = await db
    .select({
      product: schema.products,
      freightClassifications: freightLinks,
      freightClass: freightClass,
      
  })
    .from(schema.products)
    .innerJoin(
      freightLinks,
      eq(schema.products.productId, freightLinks.productId)
    )
    .innerJoin(
      freightClass,
      eq(freightLinks.classificationId, freightClass.classificationId)
    )
    .where(eq(schema.products.sku, hardCodedSku))
    .execute();
    console.log(product);
    return product;
}

const client = createClient<paths>({ baseUrl: process.env.SANDBOX_FREIGHTVIEW_BASE_URL});

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

export async function bookFreight(orderData: IOrderPaginationResult, lifgate: boolean) {
  try {
    console.log(orderData.orders);
    const token = await generateToken();
    if (token.error) {
      return {
        error: {
          message: token.error.message,
        }
      }
    }
    const validatedToken = authSchema.safeParse(token);
    console.log(validatedToken);
    if (!validatedToken.success) {
      let errorMessage = "";
      validatedToken.error.issues.forEach((issue) => {
        errorMessage = issue.message + ". ";
      });
      return {
        error: {
          message: errorMessage,
        }
      };
    }
    const access_token = validatedToken.data.data.access_token;
    if (orderData.orders[0]?.items[0] !== undefined) {
      const freightProduct = await getData(orderData.orders[0].items[0].sku);
      // const response = await createShipment(access_token, orderData, lifgate, freightProduct);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function generateToken() { 
  return await client.POST("/v2.0/auth/token", {
    body: {
      client_id: process.env.VERCEL_FREIGHTVIEW_CLIENT_ID || '',
      client_secret: process.env.VERCEL_FREIGHTVIEW_CLIENT_SECRET || '',
      grant_type: "client_credentials", 
    }
  });
};

function parseWeight(order: IOrder): number {
  const weightRegex = /(\d+)\s*(LBS|pound|pounds)/i;
  const match = order.internalNotes.match(weightRegex);
  if (match && match[1]) {
      const weight = parseFloat(match[1]);
      return parseFloat(weight.toFixed(2));
  } else {
      throw new Error('Invalid weight in internal notes');
  }
}

// async function createShipment(access_token: string, orderData: IOrderPaginationResult, liftgate: boolean, freightProduct: FreightProductData) {

//   const now = new Date();
//   const todayDate  = date.format(now, 'YYYY-MM-DD');
//   const liftgateRequired = liftgate ? "liftgate" : "";
//   let weight: number;
//   let handlingUnit: string;
//   if (orderData.orders[0] !== undefined) {
//       weight = parseWeight(orderData.orders[0]);
//   } else {
//     throw new Error('No order data found');
//   }
//   return await client.POST("/v2.0/shipments/truckload", {
//     body: {
//       locations: [{
//         company: "Alliance Chemical",
//         address: "204 South Edmond Street",
//         postalCode: "76574",
//         city: "Taylor",
//         state: "Texas",
//         country: "us",
//         stopDate: todayDate,
//         stopDateType: "on",
//         stopType: "pickup",
//         sequence: 0,
//         opensAt: "09:00",
//         closesAt: "16:00",
//         contactName: "Adnan Heikal",
//         contactPhone: "512-365-6838",
//         contactPhoneExt: "516",
//         contactEmail: "adnan.heikal@alliancechemical.com",
//       },
//       {
//         company: orderData.orders[0]?.shipTo.company,
//         address: orderData.orders[0]?.shipTo.street1,
//         address2: orderData.orders[0]?.shipTo.street2,
//         postalCode: orderData.orders[0]?.shipTo.postalCode ?? '',
//         city: orderData.orders[0]?.shipTo.city,
//         state: orderData.orders[0]?.shipTo.state,
//         country: "us",
//         stopDateType: "by",
//         stopType: "delivery",
//         sequence: 1,
//         opensAt: "09:00",
//         closesAt: "16:00",
//         contactName: orderData.orders[0]?.shipTo.name,
//         contactPhone: orderData.orders[0]?.shipTo.phone,
//         contactEmail: orderData.orders[0]?.customerEmail,  
//       },
//   ],
//   billTo: {
//     company: "Alliance Chemical",
//     address: "P.O. Box 445",
//     city: "Hutto",
//     state: "Texas",
//     postalCode: "78634",
//     country: "us",
//     contactName: "Adnan Heikal",
//     contactPhone: "512-365-6838",
//     contactPhoneExt: "516",
//     contactEmail: "adnan.heikal@alliancechemical.com"
//   },
//   equipment: {
//     type: "ltl",
//     accessorials: [
//       {
//         key: "liftgate"
//       }
//     ],
//     description: "Chemical",
//     declaredValue: orderData.orders[0]?.orderTotal,
//     declaredValueCurrency: "usd",
//     weight: weight,
//     weightUOM: "lbs",
//     isHazardous: true,
//   },
//   emergencyContact: {
//     name: "Chemtel",
//     phone: "800-255-3924",
//   },
//   isLiveLoad: true,
//   items: {
//     itemId: '',
//     dimensionsUOM: "in",
//     freightClass: 50,
//     height: 0,
//     length: 0,
//     nmfcNumber: 0,
//     nmfcSubNumber: 0,
//     quantity: 1,
//     width: 0,
//     pickupLocationSequence: 0,
//     dropLocationSequence: 1,
//     stackable: false,
//     weight: 0,
//     weightUOM: "lbs",
//     description: handlingUnit,
//     contains: {},
//     hazardous: {}

    

//   }


  
  
