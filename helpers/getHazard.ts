import type { EnrichedOrder } from "@/helpers/EnrichedOrder";
import type { PackingGroup } from "@/helpers/getPackingGroup";
import { getPackingGroup } from "@/helpers/getPackingGroup";

export function getHazard(items: EnrichedOrder) {
  const packing_group = items.enrichedItems[0].additionalData[0].freightClass
    .packing_group
    ? items.enrichedItems[0].additionalData[0].freightClass.packing_group
    : undefined;
  if (items.enrichedItems[0].additionalData[0].freightClass.hazard_id) {
    return {
      hazmatId: items.enrichedItems[0].additionalData[0].freightClass.hazard_id,
      packingGroup: getPackingGroup(packing_group) as PackingGroup,
    };
  } else {
    return undefined;
  }
}
