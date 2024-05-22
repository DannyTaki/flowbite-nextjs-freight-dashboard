import type { EnrichedOrder } from "@/helpers/EnrichedOrder";
import type { PackingGroup } from "@/helpers/getPackingGroup";
import { getPackingGroup } from "@/helpers/getPackingGroup";
import type { components } from "@/types/book-freight/schema";

export type Hazard = components["schemas"]["HazardousMaterial"];

export function getHazard(items: EnrichedOrder): Hazard | undefined {
  const packing_group =
    items.enrichedItems[0].additionalData[0].freightClass.packing_group;
  if (items.enrichedItems[0].additionalData[0].freightClass.hazard_id) {
    return {
      hazmatId: items.enrichedItems[0].additionalData[0].freightClass.hazard_id,
      packingGroup: getPackingGroup(packing_group) as PackingGroup,
    };
  } else {
    return undefined;
  }
}
