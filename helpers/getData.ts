"use server";

import { getShipStationProducts } from "@/app/actions/action";
import * as schema from "@/app/db/drizzle/schema";
import type {
  InsertFreightClassification,
  InsertProduct,
  InsertProductFreightLink,
  InsertProductFreightLinkage,
} from "@/types/db/types";
import { neon } from "@neondatabase/serverless";
import algoliasearch from "algoliasearch";
import { eq, inArray, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { alias } from "drizzle-orm/pg-core";

export type EnrichedItem = Awaited<ReturnType<typeof getData>>;
export type ChemicalData = Awaited<
  ReturnType<typeof getFreightClassifications>
>;
type AlgoliaData =
  | InsertProduct[]
  | InsertFreightClassification[]
  | InsertProductFreightLink[]
  | InsertProductFreightLinkage[];
enum SearchIndex {
  Products = "products",
  FreightClassifications = "freight_classifications",
  ProductFreightLinkages = "product_freight_linkages",
  ProductFreightLinks = "product_freight_links",
}

export type Products = Awaited<ReturnType<typeof getProducts>>;

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID!,
  process.env.ALGOLIA_WRITE_API_KEY!,
);

export async function getData(sku: string) {
  const freightLinks = alias(schema.product_freight_links, "freightLinks");
  const freightClass = alias(schema.freight_classifications, "freightClass");
  const product = await db
    .select({
      product: schema.products,
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

export async function getFreightClassifications() {
  try {
    const classifications = await db
      .select({
        classification_id: schema.freight_classifications.classification_id,
        description: schema.freight_classifications.description,
        nmfc: schema.freight_classifications.nmfc,
        freight_class: schema.freight_classifications.freight_class,
        hazardous: schema.freight_classifications.hazardous,
        hazard_id: schema.freight_classifications.hazard_id,
        hazard_class: schema.freight_classifications.hazard_class,
        packing_group: schema.freight_classifications.packing_group,
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
export async function updateFreightClassification(
  chemical: InsertFreightClassification,
) {
  try {
    if (chemical.classification_id === undefined) {
      throw new Error(
        "classification_id is required to update a chemical entry.",
      );
    }
    await db
      .update(schema.freight_classifications)
      .set({
        description: chemical.description,
        nmfc: chemical.nmfc,
        freight_class: chemical.freight_class,
        hazardous: chemical.hazardous,
        hazard_id: chemical.hazard_id,
        hazard_class: chemical.hazard_class,
        packing_group: chemical.packing_group,
        sub: chemical.sub,
      })
      .where(
        eq(
          schema.freight_classifications.classification_id,
          chemical.classification_id,
        ),
      )
      .execute();

    updateAlgoliaIndex(SearchIndex.FreightClassifications, [chemical]);
  } catch (error) {
    console.error("Error updating chemical entry:", error);
  }
}
async function triggerAlgoliaSync() {
  try {
    // Trigger the Algolia sync
    const response = await fetch(
      "https://app.getcensus.com/api/v1/syncs/852183/trigger",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer secret-token:hZ3Q2RYkqbBdb4bAJNnUSZWe",
          "Content-Type": "application/json",
        },
      },
    );

    const responseData = await response.json();

    if (!response.ok || responseData.status !== "success") {
      const errorMessage = responseData.message || response.statusText;
      throw new Error(`Failed to trigger sync: ${errorMessage}`);
    }

    console.log(
      "Successfully triggered Algolia sync, sync_run_id:",
      responseData.data.sync_run_id,
    );
  } catch (error) {
    console.error("Error triggering Algolia sync:", error);
  }
}

export async function createFreightClassification(
  chemical: InsertFreightClassification,
) {
  try {
    const newChemicalEntry = await db
      .insert(schema.freight_classifications)
      .values({
        description: chemical.description,
        nmfc: chemical.nmfc,
        freight_class: chemical.freight_class,
        hazardous: chemical.hazardous,
        hazard_id: chemical.hazard_id,
        packing_group: chemical.packing_group,
        sub: chemical.sub,
      })
      .onConflictDoNothing()
      .returning()
      .execute();

    createObjectAlgoliaIndex(
      SearchIndex.FreightClassifications,
      newChemicalEntry,
    );
  } catch (error) {
    console.error("Error adding chemical entry:", error);
  }
}

export async function deleteFreightClassifications(
  classification_ids: number[],
) {
  try {
    const recordsToDelete = await db
      .select()
      .from(schema.freight_classifications)
      .where(
        inArray(
          schema.freight_classifications.classification_id,
          classification_ids,
        ),
      )
      .execute();

    const recordstoUpdate = await db
      .select()
      .from(schema.product_freight_linkages)
      .where(
        inArray(
          schema.product_freight_linkages.classification_id,
          classification_ids,
        ),
      )
      .execute();

    await db
      .delete(schema.freight_classifications)
      .where(
        inArray(
          schema.freight_classifications.classification_id,
          classification_ids,
        ),
      )
      .execute();

    console.log(
      `Deleted chemical entries with classification IDs: ${classification_ids.join(", ")}`,
    );

    deleteObjectAlgoliaIndex(
      SearchIndex.FreightClassifications,
      recordsToDelete,
    );
    updateAlgoliaIndex(SearchIndex.ProductFreightLinkages, recordstoUpdate);
  } catch (error) {
    console.error("Error deleting chemical entries:", error);
  }
}

export async function getProducts() {
  try {
    const products = await db.select().from(schema.products).execute();
    return products;
  } catch (error) {
    console.error("Error returning product data:", error);
  }
}

export async function addProduct(products: InsertProduct[]) {
  const newProducts: InsertProduct[] = [];
  const newProductFreightLinkages: InsertProductFreightLinkage[] = [];
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
        const newProduct = await db
          .insert(schema.products)
          .values({
            sku: product.sku,
            name: product.name,
            // Add other fields if necessary
          })
          .returning()
          .execute();
        if (typeof newProduct[0].product_id === "number") {
          const newProductFreightLinkage = await db
            .select()
            .from(schema.product_freight_linkages)
            .where(
              eq(
                schema.product_freight_linkages.product_id,
                newProduct[0].product_id,
              ),
            )
            .execute();

          if (newProductFreightLinkage.length === 1) {
            newProductFreightLinkages.push(newProductFreightLinkage[0]);
            console.log(
              `Product Freight Linkage with SKU ${product.sku} added successfully.`,
            );
          } else {
            console.error(
              `Error adding product freight linkage with SKU ${product.product_id} and SKU ${product.sku}.`,
            );
          }
        } else {
          throw new Error("Product ID must be defined as a number");
        }

        // Push the inserted product to the newProducts array
        if (newProduct.length === 1) {
          newProducts.push(newProduct[0]);
          console.log(`Product with SKU ${product.sku} added successfully.`);
        } else {
          console.error(`Error adding product with SKU ${product.sku}.`);
        }
      } else {
        console.log(`Product with SKU ${product.sku} already exists.`);
      }
    }
    createObjectAlgoliaIndex(SearchIndex.Products, newProducts);
    createObjectAlgoliaIndex(
      SearchIndex.ProductFreightLinkages,
      newProductFreightLinkages,
    );
    return newProducts;
  } catch (error) {
    console.error("Error adding product:", error);
  }
}

export async function updateProduct(products: InsertProduct[]) {
  console.log("Updating Product(s)");
  try {
    for (const product of products) {
      if (product.product_id !== undefined) {
        const updatedProduct = await db
          .update(schema.products)
          .set({
            packaging_type: product.packaging_type || null,
            unit_container_type: product.unit_container_type || null,
          })
          .where(eq(schema.products.product_id, product.product_id))
          .returning({
            product_id: schema.products.product_id,
            name: schema.products.name,
          })
          .execute();
        console.log("Updated product:", updatedProduct);
        updateAlgoliaIndex(SearchIndex.Products, products);
      } else {
        console.error(`Product ID is undefined for SKU: ${product.sku}`);
      }
    }
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

export async function updateAlgoliaIndex(
  searchIndex: SearchIndex,
  data: AlgoliaData,
) {
  const index = client.initIndex(searchIndex);
  try {
    if (data.length > 0) {
      const response = await index.partialUpdateObjects(data, {
        createIfNotExists: false,
      });
      console.log(
        `Algolia index updated successfully for ${searchIndex}:`,
        response,
      );
    } else {
      console.log(`No ${searchIndex} to update in Algolia index.`);
    }
  } catch (error) {
    console.error("Error updating Algolia index:", error);
  }
}

export async function createObjectAlgoliaIndex(
  searchIndex: SearchIndex,
  data: AlgoliaData,
) {
  const index = client.initIndex(searchIndex);

  try {
    if (data.length > 0) {
      await index.saveObjects(data, {
        autoGenerateObjectIDIfNotExist: false,
      });
    } else {
      console.log(`No ${searchIndex} to add to Algolia index.`);
    }
  } catch (error) {
    console.error(`Error adding ${searchIndex} to Algolia index:`, error);
  }
}

function extractObjectIDs(data: AlgoliaData): string[] {
  return data
    .map((item) => item.objectID)
    .filter((id) => id !== null && id !== undefined) as string[];
}

export async function deleteObjectAlgoliaIndex(
  searchIndex: SearchIndex,
  data: AlgoliaData,
) {
  const index = client.initIndex(searchIndex);

  try {
    if (data.length > 0) {
      const objectIDs = extractObjectIDs(data);
      await index.deleteObjects(objectIDs);
    } else {
      console.log(`No ${searchIndex} to delete from Algolia index.`);
    }
  } catch (error) {
    console.error(`Error deleting ${searchIndex} from Algolia index:`, error);
  }
}

export async function updateProductFreightLinks(
  products: Pick<InsertProduct, "product_id" | "name">[],
): Promise<void> {
  console.log("Adding Product Freight Links");
  try {
    const newViewRecords: InsertProductFreightLinkage[] = [];
    for (const product of products) {
      console.log("Product:", product);
      if (product.product_id) {
        // Check if a record with the given product_id already exists
        const existingLink = await db
          .select({
            product_id: schema.product_freight_links.product_id,
          })
          .from(schema.product_freight_links)
          .where(
            eq(schema.product_freight_links.product_id, product.product_id),
          )
          .execute();

        if (existingLink.length === 0) {
          // If the record does not exist, insert the new link
          await db
            .insert(schema.product_freight_links)
            .values({
              product_id: product.product_id,
            })
            .execute();
          console.log(
            `Product Freight Link for ${product.name} added successfully for product_id ${product.product_id}.`,
          );

          const newViewRecord = await db
            .select()
            .from(schema.product_freight_linkages)
            .where(
              eq(
                schema.product_freight_linkages.product_id,
                product.product_id,
              ),
            )
            .execute();

          console.log("Newly created view record:", newViewRecord[0]);
          newViewRecords.push(newViewRecord[0]);
        }
      }
    }
    createObjectAlgoliaIndex(
      SearchIndex.ProductFreightLinkages,
      newViewRecords,
    );
  } catch (error) {
    console.error("Error adding Product Freight Links:", error);
    throw error;
  }
}

export async function getUnlinkedProducts() {
  try {
    const unlinkedProducts = await db
      .select()
      .from(schema.product_freight_linkages)
      .where(isNull(schema.product_freight_linkages.classification_id))
      .execute();
    return unlinkedProducts;
  } catch (error) {
    console.error("Error returning unlinked products:", error);
  }
}

export async function updateProductFreightLink(
  updates: { link_id: number; classification_id: number }[],
): Promise<void> {
  try {
    console.log("Starting update process for product freight links.");

    if (!updates || updates.length === 0) {
      console.log("No updates provided.");
      return;
    }

    console.log("Updates to process:", updates);

    const updatePromises = updates.map(async (update) => {
      try {
        console.log(
          `Updating link ID: ${update.link_id} with classification ID: ${update.classification_id}`,
        );

        // Update the record in the database
        await db
          .update(schema.product_freight_links)
          .set({
            classification_id: update.classification_id,
          })
          .where(eq(schema.product_freight_links.link_id, update.link_id))
          .execute();

        // Retrieve the updated record
        const updatedRecord = await db
          .select()
          .from(schema.product_freight_links)
          .where(eq(schema.product_freight_links.link_id, update.link_id))
          .execute();

        console.log(
          `Updated record for link ID ${update.link_id}:`,
          updatedRecord[0],
        );
        return updatedRecord[0];
      } catch (innerError) {
        console.error(`Error updating link ID ${update.link_id}:`, innerError);
        throw innerError;
      }
    });

    const updatedRecords = await Promise.all(updatePromises);
    console.log("Updated records:", updatedRecords);

    // Pass the updated records to the updateAlgoliaIndex function
    await updateAlgoliaIndex(SearchIndex.ProductFreightLinks, updatedRecords);
  } catch (error) {
    console.error("Error updating product freight links:", error);
    throw error;
  }
}

export async function findUnsynchronizedProducts() {
  try {
    const shipstationProducts = await getShipStationProducts();
    const databaseProducts = await getProducts();
    if (!databaseProducts) {
      throw new Error("No database products found");
    }

    // Extract SKUs from shipstationProducts
    const shipstationSKUs = shipstationProducts.map((product) => product.sku);
    // Find products in databaseProducts that are not in shipstationProducts
    const productsNotInShipstation = databaseProducts.filter(
      (product) => !shipstationSKUs.includes(product.sku),
    );

    // Log or return the products that are missing from shipstationProducts
    console.log(
      "Products not in ShipStation Products:",
      productsNotInShipstation,
    );

    return productsNotInShipstation;
  } catch (error) {
    console.error("Error finding product freight links:", error);
  }
}

export async function deleteProducts(products: Products) {
  try {
    const productRecords: InsertProduct[] = [];
    const productFreightLinkagesRecords: InsertProductFreightLinkage[] = [];
    const filteredProducts =
      products?.filter((product) => product !== undefined) || [];
    const productIds = filteredProducts
      .map((product) => product.product_id)
      .filter((id): id is number => id !== undefined);

    if (productIds.length > 0) {
      for (const productId of productIds) {
        const productRecord = await db
          .select()
          .from(schema.products)
          .where(eq(schema.products.product_id, productId))
          .execute();

        const productFreightLinkagesRecord = await db
          .select()
          .from(schema.product_freight_linkages)
          .where(eq(schema.product_freight_linkages.product_id, productId))
          .execute();

        await db
          .delete(schema.products)
          .where(eq(schema.products.product_id, productId));

        productRecords.push(productRecord[0]);
        console.log(`Deleted product with ID: ${productId}`);
        productFreightLinkagesRecord.push(productFreightLinkagesRecord[0]);
      }

      console.log(`Deleted products with IDs: ${productIds.join(", ")}`);
      deleteObjectAlgoliaIndex(SearchIndex.Products, productRecords);
      deleteObjectAlgoliaIndex(
        SearchIndex.ProductFreightLinkages,
        productFreightLinkagesRecords,
      );
    } else {
      console.log("No valid product IDs found to delete.");
    }
  } catch (error) {
    console.error("Error deleting products:", error);
  }
}

export async function deleteProductFreightLinks(
  products?: Products,
  classificationIds?: number[],
) {
  try {
    const filteredProducts =
      products?.filter((product) => product !== undefined) || [];
    const productIds = filteredProducts
      .map((product) => product.product_id)
      .filter((id): id is number => id !== undefined);

    if (productIds.length > 0) {
      console.log("Deleting product freight links for products:", productIds);
      for (const productId of productIds) {
        await db
          .delete(schema.product_freight_links)
          .where(eq(schema.product_freight_links.product_id, productId));

        console.log("Deleted product freight links for product ID:", productId);
      }
    } else {
      console.log(
        "No valid product IDs found to delete product freight links.",
      );
    }

    const filteredClassificationIds =
      classificationIds?.filter((id) => id !== undefined) || [];

    if (filteredClassificationIds.length > 0) {
      console.log(
        "Deleting product freight links for classification IDs:",
        filteredClassificationIds,
      );
      for (const classificationId of filteredClassificationIds) {
        await db
          .update(schema.product_freight_links)
          .set({ classification_id: null })
          .where(
            eq(
              schema.product_freight_links.classification_id,
              classificationId,
            ),
          )
          .execute();

        console.log(
          "Updated product freight links for classification ID:",
          classificationId,
        );

        const productFreightLinkageRecords = await db
          .select()
          .from(schema.product_freight_linkages)
          .where(
            eq(
              schema.product_freight_linkages.classification_id,
              classificationId,
            ),
          )
          .execute();

        updateAlgoliaIndex(
          SearchIndex.ProductFreightLinkages,
          productFreightLinkageRecords,
        );
      }
    } else {
      console.log("No valid classification IDs provided.");
    }
  } catch (error) {
    console.error("Error deleting product freight links:", error);
  }
}
