import type { components } from "@/types/book-freight/schema";

export type LTLItem = components["schemas"]["Rates.LTL.RateToBookRequest"]["items"];
export type FreightClass = components["schemas"]["FreightClass"];
export type PackagingType = components["schemas"]["LTLPackagingType"];
export type SaidToContainOptions = components["schemas"]["SaidToContainOptions"];
export type LTLPackagingType = components["schemas"]["LTLPackagingType"];

export interface ErrorResult {
  error: {
    message: string;
  };
}

