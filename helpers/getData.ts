"use server";

import * as schema from "@/app/db/drizzle/schema";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { alias } from "drizzle-orm/pg-core";

export type EnrichedItem = Awaited<ReturnType<typeof getData>>;

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export async function getData(sku: string) {
  const hardCodedSku = "M1G-9XQ-Q4C";
  console.log("Getting data: " + sku);
  const freightLinks = alias(schema.productFreightLinks, "freightLinks");
  const freightClass = alias(schema.freightClassifications, "freightClass");
  const product = await db
    .select({
      product: schema.products,
      freightClassifications: freightLinks,
      freightClass: freightClass,
    })
    .from(schema.products)
    .innerJoin(
      freightLinks,
      eq(schema.products.productId, freightLinks.productId),
    )
    .innerJoin(
      freightClass,
      eq(freightLinks.classificationId, freightClass.classificationId),
    )
    .where(eq(schema.products.sku, sku))
    .execute();
  console.log(product);
  return product;
}

export async function getChemicalData() {
  try {
    const classifications = await db
      .select({
        classificationId: schema.freightClassifications.classificationId,
        description: schema.freightClassifications.description,
        nmfc: schema.freightClassifications.nmfc,
        freightClass: schema.freightClassifications.freightClass,
        hazardous: schema.freightClassifications.hazardous,
        hazardId: schema.freightClassifications.hazardId,
        packingGroup: schema.freightClassifications.packingGroup,
        sub: schema.freightClassifications.sub,
      })
      .from(schema.freightClassifications)
      .execute();
    return classifications;
  } catch (error) {
    console.error(error);
  }
}
