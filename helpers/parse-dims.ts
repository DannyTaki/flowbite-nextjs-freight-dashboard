import { EnrichedOrder } from "./EnrichedOrder";

export type Dimensions = Awaited<ReturnType<typeof parseDimensionsAndQty>>;
export function parseDimensionsAndQty(order: EnrichedOrder): {
    qty: number;
    length: number;
    width: number;
    height: number;
  } {
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
      throw new Error("Invalid dimensions and qty in internal notes");
    }
  }