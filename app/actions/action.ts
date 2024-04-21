"use server";

import { authSchema, optsSchema } from "@/types/optsSchema";
import Shipstation from "shipstation-node";
import type { IOrderPaginationResult, IOrder } from "shipstation-node/typings/models";
import type { paths, components } from "@/types/book-freight/schema";
import createClient from "openapi-fetch";
import date from 'date-and-time';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/app/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { Schema } from "zod";
import { alias } from "drizzle-orm/pg-core";
import { DrawerItems } from "flowbite-react";
import { Component } from "react";


type EnrichedOrder = Awaited<ReturnType<typeof getEnrichedOrder>>;
type EnrichedItem = Awaited<ReturnType<typeof getData>>;
type Dimensions = Awaited<ReturnType<typeof parseDimensions>>;
type LTLItem = components["schemas"]["Rates.LTL.RateToBookRequest"]["items"];
type FreightClass = components["schemas"]["FreightClass"]


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

async function getEnrichedOrder(orderData: IOrderPaginationResult) {
  // Prepare to accumulate all enriched order data
  const order = orderData.orders[0];


  console.log(`Processing order: ${order.orderId}`);
    
  // Array to hold enriched items for this order
  const enrichedItems = [];

  for (const item of order.items) { 
    const itemData = await getData(item.sku);
    console.log(`Data for item ${item.sku} in order ${order.orderNumber}:`, itemData);

    enrichedItems.push({
      ...item,
      additionalData: itemData
    })
  }
  const enrichedOrder = {
    ...order, 
    enrichedItems: enrichedItems
  };
  return enrichedOrder;
}



export async function bookFreight(orderData: IOrderPaginationResult, liftgate: boolean, limitedAccess: boolean) {
  try {
    if (!orderData || orderData.orders.length === 0) {
      console.log("No orders found");
      return 'No orders available';
    }
    if (orderData.orders.length > 1) {
      console.log("Only one order can be processed at a time");
      return 'Only one order can be processed at a time';
    }

      const enrichedOrder = await getEnrichedOrder(orderData);
      console.log(enrichedOrder);
      // const shipmentResult = await rateLtlShipment(EnrichedOrder, liftgate, limitedAccess)
    } catch (error) {
    console.log(error);
    return null;
  }
};

function validateFreightClass(freightClass: number | undefined): FreightClass {
  const validClasses: number[] = [50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500];
  if (freightClass !== undefined && validClasses.includes(freightClass)) {
    return freightClass as FreightClass;
  } else {
    throw new Error('Invalid freight class');
  }
    
    




function mapToLTLItem(items: EnrichedItem, weight: number, dimensions: Dimensions): LTLItem {
  let LTLitems: LTLItem;

  // How many shipments are there in the order? => check the internal notes parse qty
  const numberOfShipments = parse
  
  items.forEach(item => {
    LTLitems.forEach( ltlItem => {
      ltlItem.description = item.product.name,
      ltlItem.weight = weight,
      ltlItem.freightClass = validateFreightClass(parseInt(item.freightClass.freightClass, 10)),
      ltlItem.length = dimensions.length,
      ltlItem.width = dimensions.width,
      ltlItem.height = dimensions.height, 

    })
  })
  return items;
}
  


   


async function rateLtlShipment(order: EnrichedOrder , liftgate: boolean, limitedAccess: boolean) {
  const now = new Date();
  const todayDate  = date.format(now, 'YYYY-MM-DD');
  const totalWeight = parseWeight(order) 
  const dimensions = parseDimensionsAndQty(order);
  let destType: "business dock" | "business no dock" | "residential" | "limited access" | "trade show" | "construction" | "farm" | "military" | "airport" | "place of worship" | "school" | "mine" | "pier" | undefined;
  order.enrichedItems.forEach( item => mapToLTLItem(item.additionalData, totalWeight, dimensions));
  if (liftgate && !order.shipTo.residential) { 
    destType = "business no dock";
  } else if (order.shipTo.residential) {
     destType = "residential";
  } else if (limitedAccess) {
    destType = "limited access";
  } else {
    destType = "business dock";
  }
  return await client.POST("/rates", {
    body: {
      pickupDate: todayDate,
      charges: liftgate ? ["liftgate delivery"] : undefined,
      originCompany: "Alliance Chemical",
      originAddress: "204 South Edmond Street",
      originCity: "Taylor",
      originState: "TX",
      originPostalCode: "76574",
      originCountry: "USA",
      originType: "business dock",
      originContactName: "Adnan Heikal",
      originContactPhone: "512-365-6838",
      originContactEmail: "adnan.heikal@alliancechemical.com",
      originReferenceNumber: order.orderNumber,
      originDockHoursOpen: "09:00 AM",
      originDockHoursClose: "04:00 PM",
      destCompany: order.shipTo.company ? order.shipTo.company : undefined,
      destAddress: order.shipTo.street1,
      destAddress2: order.shipTo.street2 ? order.shipTo.street2 : undefined,  
      destCity: order.shipTo.city,
      destState: order.shipTo.state,
      destPostalCode: order.shipTo.postalCode,
      destCountry: "USA",
      destType: destType,
      destContactName: order.shipTo.name,
      destContactPhone: order.shipTo.phone,
      destContactEmail: order.customerEmail,
      destReferenceNumber: order.orderNumber,
      destDockHoursOpen: "09:00 AM",
      destDockHoursClose: "04:00 PM",
      billPostalCode: order.shipTo.postalCode,
      billCountry: "USA",
      items: [

      ]




      


    }
  })
}

  
  return;
}

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


function parseDimensionsAndQty(order: EnrichedOrder): { qty: number; length: number; width: number; height: number } {
  const regex = /(\d+)@(\d+)x(\d+)x(\d+)/; // Pattern to match 'Qty@Length x Width x Height'
  const match = order.internalNotes.match(regex);

  if (match) {
    const qty = parseInt(match[1], 10);
    const length = parseInt(match[2], 10);
    const width = parseInt(match[3], 10);
    const height = parseInt(match[4], 10);

    return {
      qty: qty,
      length: length,
      width: width,
      height: height,
    };
  } else {
    throw new Error('Invalid dimensions and qty in internal notes');
  }
}




















/* V2 API Oauth token generation */

// async function generateToken() { 
//   const token = await client.POST("/v2.0/auth/token", {
//     body: {
//       client_id: process.env.VERCEL_FREIGHTVIEW_CLIENT_ID || '',
//       client_secret: process.env.VERCEL_FREIGHTVIEW_CLIENT_SECRET || '',
//       grant_type: "client_credentials", 
//     }
//   });
//   if (token.error) {
//     return {
//       error: {
//         message: token.error.message,
//       }
//     }
//   }
//   const validatedToken = authSchema.safeParse(token);
//   console.log(validatedToken);
//   if (!validatedToken.success) {
//     let errorMessage = "";
//     validatedToken.error.issues.forEach((issue) => {
//       errorMessage = issue.message + ". ";
//     });
//     return {
//       error: {
//         message: errorMessage,
//       }
//     };
//   }
//   const access_token = validatedToken.data.data.access_token;
//   return access_token;
// };



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


  
  
