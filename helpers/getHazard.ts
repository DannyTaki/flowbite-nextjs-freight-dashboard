import type { EnrichedOrder } from "@/helpers/EnrichedOrder";
import type { PackingGroup } from "@/helpers/getPackingGroup";
import { getPackingGroup } from "@/helpers/getPackingGroup";
import type { components } from "@/types/book-freight/schema";

export type Hazard = components["schemas"]["HazardousMaterial"];

export function getHazard(items: EnrichedOrder): Hazard | undefined {
  const packingGroup =
    items.enrichedItems[0].additionalData[0].freightClass.packingGroup;
  if (items.enrichedItems[0].additionalData[0].freightClass.hazardId) {
    return {
      hazmatId: items.enrichedItems[0].additionalData[0].freightClass.hazardId,
      packingGroup: getPackingGroup(packingGroup) as PackingGroup,
    };
  } else {
    return undefined;
  }
}
