"use server";

import { getEnrichedOrder } from "@/helpers/EnrichedOrder";
import type { ErrorResult } from "@/types/book-freight/action-types";
import type { paths } from "@/types/book-freight/mycarrierSchema";
import { optsSchema } from "@/types/optsSchema";
import createClient from "openapi-fetch";
import Shipstation from "shipstation-node";
import type { IOrderPaginationResult } from "shipstation-node/typings/models";
import { Client } from "@upstash/qstash";
import CustomShipStationAPI from "../_shipstation/CustomShipstationAPI";

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
})
const schedules = qstashClient.schedules;

const credentials = {
  key: process.env.VERCEL_SHIPSTATION_KEY,
  secret: process.env.VERCEL_SHIPSTATION_SECRET,
};

const shipStation = new Shipstation({
  apiKey: credentials.key,
  apiSecret: credentials.secret,
});

const client = createClient<paths>({
  baseUrl: process.env.MYCARRIER_BASE_URL,
});

const options = {
  apiKey: process.env.SHIPSTATION_API_KEY!,
  apiSecret: process.env.SHIPSTATION_API_SECRET!,
}

const shipstation = new CustomShipStationAPI(options);

// export async function startBackgroundJob() {
//   await qstashClient.publishJSON({
//     url: "https://firstqstashmessage.requestcatcher.com/test",
//     body: {
//       hello: "world",
//     }
//   });
// }

await schedules.create({
  destination: "example.com",
  cron: "0 0 * * *", // Run every day at midnight

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

export async function bookFreight(
  orderData: IOrderPaginationResult,
  liftgate: boolean,
  limitedAccess: boolean,
) {
  try {
    if (!orderData || orderData.orders.length === 0) {
      console.log("No orders found");
      return "No orders available";
    }
    if (orderData.orders.length > 1) {
      console.log("Only one order can be processed at a time");
      return "Only one order can be processed at a time";
    }

    const enrichedOrder = await getEnrichedOrder(orderData);
    console.log(enrichedOrder);
    // const shipmentResult = await rateLtlShipment(EnrichedOrder, liftgate, limitedAccess)
    const quotes = await getQuotes(enrichedOrder, liftgate, limitedAccess);
    return quotes;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// async function getQuotes(
//   order: EnrichedOrder,
//   liftgate: boolean,
//   limitedAccess: boolean,
// ) {
//     const now = new Date();
//     const todayDate = date.format(now, "YYYY-MM-DD");
//     const formattedDate = date.format(now, "MM/DD/YYYY h:mm A");
//     const weight = parseWeight(order);
//     const dimensions = parseDimensionsAndQty(order);

//     return await client.POST("/api/Orders", {
//       body: {
//         orders: [
//           {
//             quoteReferenceID: order.orderNumber + " " + todayDate,
//             serviceType: "LTL",
//             pickupDate: todayDate,
//             paymentDirection: "Prepaid",
//             carrierService: "Standard",
//             emergencyContactPersonName: "Chemtel",
//             emergencyContactPhone: "800-255-3924",
//             readyToDispatch: "YES",  // What does this mean?
//             timeCreated: formattedDate,
//             isVicsBol: "YES",
//             references: {
//               referenceNumber: order.orderNumber,
//             },
//             destinationAccessorials: {
//               notifyBeforeDelivery: "NO",
//               liftgateDelivery: liftgate ? "YES" : "NO",
//               sortOrSegregateDelivery: "NO",
//               insideDelivery: "NO",
//               deliveryAppointment: "NO",
//             },
//             originStop: {
//               companyName: "Alliance Chemical",
//               streetLine1: "204 South Edmond Street",
//               city: "Taylor",
//               state: "TX",
//               zip: "76574",
//               country: "USA",
//               locationType: "Business",
//               contactFirstName: "Adnan",
//               contactLastName: "Heikal",
//               contactEmail: "adnan.heikal@alliancechemical",
//               contactPhone: "512-365-6838",
//               ext: "516",
//               readyTime: "09:00 AM",
//               closeTime: "04:00 PM",
//             },
//             destinationStop: {
//               companyName: order.shipTo.company ? order.shipTo.company : undefined,
//               streetLine1: order.shipTo.street1,
//               streetLine2: order.shipTo.street2 ? order.shipTo.street2 : undefined,
//               city: order.shipTo.city,
//               state: order.shipTo.state,
//               zip: order.shipTo.postalCode,
//               country: "USA",
//               locationType: order.shipTo.residential ? "Residential" : "Business",   // Make a dropdown UI element for user selection of location type
//               contactFirstName: order.shipTo.name,
//               contactPhone: order.shipTo.phone,
//               contactEmail: order.customerEmail,
//               readyTime: "09:00 AM",
//               closeTime: "04:00 PM",
//             },
//             quoteUnits: getQuoteUnits(order, dimensions),

//           }
//         ]
//       },
//     });

// function getQuoteUnits(
//   items: EnrichedOrder,
//   weight: number,
//   dimensions: Dimensions,
// ): QuoteUnits[] {
//   let LTLitems: QuoteUnits[];

//   for (let i = 0; i < dimensions.qty; i++) {
//     LTLitems.push({
//       shippingUnitType: "Pallet",
//       shippingUnitCount: dimensions.qty,
//       unitLength: dimensions.length,
//       unitWidth: dimensions.width,
//       unitHeight: dimensions.height,
//       unitStackable: "NO",
//       quoteCommodities: getQuoteCommodities(items),

//     });
//   }

//   return items;
// }

// function getQuoteCommodities(items: EnrichedOrder): QuoteCommodity[]
// {

//   let commodities: QuoteCommodity[];
//   for(let i = 0; i < items.enrichedItems.length; i++) {
//     commodities.push({
//       commodityDescription: "",
//       commodityNMFC: items.enrichedItems[i].additionalData[i].freightClass.nmfc ?? undefined,
//       commoditySub: items.enrichedItems[i].additionalData[i].
//     })
//   }

// }

// description: items.enrichedItems[i].additionalData[i].freightClass.description ?? undefined,
// weight: weight,
// freightClass: validateFreightClass(
//   parseInt(items.enrichedItems[i].additionalData[i].freightClass.freightClass, 10),
// ),
// length: dimensions.length,
// width: dimensions.width,
// height: dimensions.height,
// package: items.enrichedItems[i].additionalData[i].product.packagingType as LTLPackagingType,
// pieces: 1,
// nmfc: items.enrichedItems[i].additionalData[i].freightClass.nmfc ?? undefined,
// hazardous: items.enrichedItems[i].additionalData[i].freightClass.hazardous ?? undefined,
// hazard: getHazard(items) as Hazard,
// saidToContain: items.enrichedItems[i].additionalData[i].product.unitContainerType as SaidToContainOptions,

//   async function rateLtlShipment(
//     order: EnrichedOrder,
//     liftgate: boolean,
//     limitedAccess: boolean,
//   ) {
//     const now = new Date();
//     const todayDate = date.format(now, "YYYY-MM-DD");
//     const weight = parseWeight(order);
//     const dimensions = parseDimensionsAndQty(order);
//     let destType:
//       | "business dock"
//       | "business no dock"
//       | "residential"
//       | "limited access"
//       | "trade show"
//       | "construction"
//       | "farm"
//       | "military"
//       | "airport"
//       | "place of worship"
//       | "school"
//       | "mine"
//       | "pier"
//       | undefined;
//     const items: LTLItem = getItems(order, weight, dimensions);
//     if (liftgate && !order.shipTo.residential) {
//       destType = "business no dock";
//     } else if (order.shipTo.residential) {
//       destType = "residential";
//     } else if (limitedAccess) {
//       destType = "limited access";
//     } else {
//       destType = "business dock";
//     }
//     return await client.POST("/rates", {
//       body: {
//         pickupDate: todayDate,
//         charges: liftgate ? ["liftgate delivery"] : undefined,
//         originCompany: "Alliance Chemical",
//         originAddress: "204 South Edmond Street",
//         originCity: "Taylor",
//         originState: "TX",
//         originPostalCode: "76574",
//         originCountry: "USA",
//         originType: "business dock",
//         originContactName: "Adnan Heikal",
//         originContactPhone: "512-365-6838",
//         originContactEmail: "adnan.heikal@alliancechemical.com",
//         originReferenceNumber: order.orderNumber,
//         originDockHoursOpen: "09:00 AM",
//         originDockHoursClose: "04:00 PM",
//         destCompany: order.shipTo.company ? order.shipTo.company : undefined,
//         destAddress: order.shipTo.street1,
//         destAddress2: order.shipTo.street2 ? order.shipTo.street2 : undefined,
//         destCity: order.shipTo.city,
//         destState: order.shipTo.state,
//         destPostalCode: order.shipTo.postalCode,
//         destCountry: "USA",
//         destType: destType,
//         destContactName: order.shipTo.name,
//         destContactPhone: order.shipTo.phone,
//         destContactEmail: order.customerEmail,
//         destReferenceNumber: order.orderNumber,
//         destDockHoursOpen: "09:00 AM",
//         destDockHoursClose: "04:00 PM",
//         billPostalCode: order.shipTo.postalCode,
//         billCountry: "USA",
//         items: [],
//       },
//     });
//   }

//   return;
// }

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
