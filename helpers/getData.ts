"use server";

import * as schema from "@/app/db/drizzle/schema";
import { neon } from "@neondatabase/serverless";
import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { alias } from "drizzle-orm/pg-core";



export type EnrichedItem = Awaited<ReturnType<typeof getData>>;
export type ChemicalData = Awaited<ReturnType<typeof getChemicalData>>;
export type SingleChemicalData = {
  classificationId: number;
  description: string | null;
  nmfc: string | null;
  freightClass: number | string;
  hazardous: boolean | null;
  hazardId: string | null;
  packingGroup: string | null;
  sub: string | null;
};
export type Products = Awaited<ReturnType<typeof getProducts>>;




const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
// const classificationQuery = db.select({
// classification_id: schema.freight_classifications.classification_id,
// description: schema.freight_classifications.description,
// nmfc: schema.freight_classifications.nmfc,
// freight_class: schema.freight_classifications.freight_class,
// hazardous: schema.freight_classifications.hazardous,
// hazard_id: schema.freight_classifications.hazard_id,
// packing_group: schema.freight_classifications.packing_group,
// sub: schema.freight_classifications.sub,
// }).from(schema.freight_classifications).execute();


export async function getData(sku: string) {
  const hardCodedSku = "M1G-9XQ-Q4C";
  console.log("Getting data: " + sku);
  const freightLinks = alias(schema.product_freight_links, "freightLinks");
  const freightClass = alias(schema.freight_classifications, "freightClass");
  const product = await db
    .select({
      product: schema.products,
      freightClassifications: freightLinks,
      freightClass: freightClass,
    })
    .from(schema.products)
    .innerJoin(
      freightLinks,
      eq(schema.products.product_id, freightLinks.product_id),
    )
    .innerJoin(
      freightClass,
      eq(freightLinks.classification_id, freightClass.classification_id),
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
        classificationId: schema.freight_classifications.classification_id,
        description: schema.freight_classifications.description,
        nmfc: schema.freight_classifications.nmfc,
        freightClass: schema.freight_classifications.freight_class,
        hazardous: schema.freight_classifications.hazardous,
        hazardId: schema.freight_classifications.hazard_id,
        packingGroup: schema.freight_classifications.packing_group,
        sub: schema.freight_classifications.sub,
      })
      .from(schema.freight_classifications)
      .execute();
    return classifications;
  } catch (error) {
    console.error(error);
  }
}

// Add this to your server action code
export async function updateChemicalEntry(chemical: SingleChemicalData) {
  try {
    await db
      .update(schema.freight_classifications)
      .set({
        description: chemical.description,
        nmfc: chemical.nmfc,
        freight_class: chemical.freightClass,
        hazardous: chemical.hazardous,
        hazardId: chemical.hazardId,
        packingGroup: chemical.packingGroup,
        sub: chemical.sub,
      })
      .where(
        eq(
          schema.freight_classifications.classification_id,
          chemical.classificationId,
        ),
      )
      .execute();
  } catch (error) {
    console.error("Error updating chemical entry:", error);
  }
}

export async function addChemicalEntry(
  chemical: Omit<SingleChemicalData, "classificationId">,
) {
  try {
    await db
      .insert(schema.freight_classifications)
      .values({
        description: chemical.description,
        nmfc: chemical.nmfc,
        freight_class: chemical.freightClass,
        hazardous: chemical.hazardous,
        hazard_id: chemical.hazardId,
        packing_group: chemical.packingGroup,
        sub: chemical.sub,
      })
      .onConflictDoNothing()
      .execute();
  } catch (error) {
    console.error("Error adding chemical entry:", error);
  }
}

export async function deleteChemicalEntries(classificationIds: number[]) {
  try {
    await db
      .delete(schema.freight_classifications)
      .where(inArray(schema.freight_classifications.classification_id, classificationIds))
      .execute();
  } catch (error) {
    console.error("Error deleting chemical entries:", error);
  }
}

export async function getProducts() {
  try {
    const products = await db
      .select({
        productId: schema.products.product_id,
        sku: schema.products.sku,
        name: schema.products.name,
        packagingType: schema.products.packaging_type,
        unitContainerType: schema.products.unit_container_type,
      })
      .from(schema.products)
      .execute();
    return products;
  } catch (error) {
    console.error("Error returning product data:", error);
  }
}

export async function addProduct(products: { sku: string, name: string }[]) {
  try {
    for (const product of products) {
      // Check if a product with the given SKU exists
      const existingProduct = await db
        .select({
          sku: schema.products.sku,
          name: schema.products.name,
        })
        .from(schema.products)
        .where(eq(schema.products.sku, product.sku))
        .execute();

      if (existingProduct.length === 0) {
        // If the product does not exist, insert the new product
        await db
          .insert(schema.products)
          .values({
            sku: product.sku,
            name: product.name,
            // Add other fields if necessary
          })
          .execute();
        console.log(`Product with SKU ${product.sku} added successfully.`);
      } else {
        console.log(`Product with SKU ${product.sku} already exists.`);
      }
    }
  } catch (error) {
    console.error("Error adding product:", error);
  }
}
