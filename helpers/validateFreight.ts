import type { components } from "@/types/book-freight/schema";

type FreightClass = components["schemas"]["FreightClass"];

export function validateFreightClass(
  freightClass: number | undefined,
): FreightClass {
  const validClasses: number[] = [
    50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300,
    400, 500,
  ];
  if (freightClass !== undefined && validClasses.includes(freightClass)) {
    return freightClass as FreightClass;
  } else {
    throw new Error("Invalid freight class");
  }
}
