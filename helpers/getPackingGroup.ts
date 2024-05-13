import type { components } from "@/types/book-freight/schema";

export type PackingGroup =
  components["schemas"]["HazardousMaterial"]["packingGroup"];

export function getPackingGroup(
  packingGroup: string | null,
): PackingGroup | null {
  if (packingGroup) {
    const packingOptions: string[] = [
      "I-Great Danger",
      "II-Medium Danger",
      "III-Minor Danger",
    ];
    const index: number = parseInt(packingGroup) - 1;
    if (index >= 0 && index < packingOptions.length) {
      return packingOptions[index] as PackingGroup;
    }
    return null; // Return null if the input is not 1, 2, or 3
  } else {
    return null;
  }
}
