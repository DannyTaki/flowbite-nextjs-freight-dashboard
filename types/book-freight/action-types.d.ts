import type { components } from "@/types/book-freight/mycarrierSchema";

// export type LTLItem = components["schemas"]["Rates.LTL.RateToBookRequest"]["items"];
// export type FreightClass = components["schemas"]["FreightClass"];
// export type PackagingType = components["schemas"]["LTLPackagingType"];
// export type SaidToContainOptions = components["schemas"]["SaidToContainOptions"];
// export type LTLPackagingType = components["schemas"]["LTLPackagingType"];

// export interface ErrorResult {
//   error: {
//     message: string;
//   };
// }

export type Order = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.DataModel"];
export type OrderItem = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.OrderItem"];
export type References = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.References"];
export type OriginAccessorials = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.OriginAccessorials"];
export type DestinationAccessorials = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.DestinationAccessorials"];
export type OriginStop = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.OriginStop"];
export type DestinationStop = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.DestinationStop"];  
export type QuoteUnits = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.QuoteUnits"];
export type QuoteCommodity = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.QuoteCommodity"];
export type Result = components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.Results"];