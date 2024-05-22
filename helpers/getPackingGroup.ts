import type { components } from "@/types/book-freight/mycarrierSchema";

export type PackingGroup =
  components["schemas"]["ITM.Shared.Functions.OrderProcessing.Common.Models.UploadOrder.Commodity"]["hazmatPackingGroup"];

export function getPackingGroup(
  packingGroup: string | undefined,
): PackingGroup {
  if (packingGroup) {
    const packingOptions: string[] = ["I", "II", "III"];
    const index: number = parseInt(packingGroup) - 1;
    if (index >= 0 && index < packingOptions.length) {
      return packingOptions[index] as PackingGroup;
    }
    return undefined; // Return null if the input is not 1, 2, or 3
  } else {
    return undefined;
  }
}
