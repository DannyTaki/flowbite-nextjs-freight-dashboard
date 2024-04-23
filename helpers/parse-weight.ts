import type {
    IOrder,
  } from "shipstation-node/typings/models";

export function parseWeight(order: IOrder): number {
  const weightRegex = /(\d+)\s*(LBS|pound|pounds)/i;
  const match = order.internalNotes.match(weightRegex);
  if (match && match[1]) {
    const weight = parseFloat(match[1]);
    return parseFloat(weight.toFixed(2));
  } else {
    throw new Error("Invalid weight in internal notes");
  }
}
