import type { EnrichedOrder } from "./EnrichedOrder";

export type Dimensions = Awaited<ReturnType<typeof parseDimensionsAndQty>>;
export function parseDimensionsAndQty(order: EnrichedOrder): {
  qty: number;
  length: number;
  width: number;
  height: number;
} {
  console.log("Internal Notes:" + order.internalNotes);

  // Pattern to match 'Qty@LengthxWidthxHeight'
  const regexWithQty = /(\d+)@(\d+)x(\d+)x(\d+)/;
  // Pattern to match 'LengthxWidthxHeight'
  const regexWithoutQty = /(\d+)x(\d+)x(\d+)/;

  let match = order.internalNotes.match(regexWithQty);
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
  }

  match = order.internalNotes.match(regexWithoutQty);
  if (match) {
    const length = parseInt(match[1], 10);
    const width = parseInt(match[2], 10);
    const height = parseInt(match[3], 10);

    return {
      qty: 1, // Quantity is not present, default to 1
      length: length,
      width: width,
      height: height,
    };
  }

  throw new Error("Invalid dimensions and qty in internal notes");
}
