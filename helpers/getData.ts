import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { alias } from "drizzle-orm/pg-core";
import * as schema from "@/app/db/drizzle/schema";
import { eq } from "drizzle-orm";

export type EnrichedItem = Awaited<ReturnType<typeof getData>>;

export async function getData(sku: string) {
    const hardCodedSku = "M1G-9XQ-Q4C";
    console.log("Getting data: " + sku);
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql, { schema });
  
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