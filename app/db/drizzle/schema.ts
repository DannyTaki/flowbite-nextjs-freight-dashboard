import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    productId: serial("product_id").primaryKey().notNull(),
    sku: varchar("sku", { length: 255 }).notNull(),
    name: text("name").notNull(),
    packagingType: varchar("packaging_type", { length: 255 }),
    unitContainerType: varchar("unit_container_type", { length: 255 }),
  },
  (table) => {
    return {
      productsSkuKey: unique("products_sku_key").on(table.sku),
    };
  },
);

export const productFreightLinks = pgTable("product_freight_links", {
  linkId: serial("link_id").primaryKey().notNull(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.productId),
  classificationId: integer("classification_id")
    .notNull()
    .references(() => freightClassifications.classificationId),
});

export const freightClassifications = pgTable("freight_classifications", {
  classificationId: serial("classification_id").primaryKey().notNull(),
  description: text("description"),
  mode: varchar("mode", { length: 255 }),
  package: varchar("package", { length: 255 }),
  declaredValue: numeric("declared_value"),
  weight: numeric("weight"),
  height: numeric("height"),
  length: numeric("length"),
  width: numeric("width"),
  stackable: boolean("stackable"),
  pieces: integer("pieces"),
  nmfc: varchar("nmfc", { length: 255 }),
  freightClass: numeric("freight_class").notNull(),
  hazardous: boolean("hazardous"),
  hazard: varchar("hazard", { length: 255 }),
  saidToContain: varchar("said_to_contain", { length: 255 }),
  saidToContainPackagingType: varchar("said_to_contain_packaging_type", {
    length: 255,
  }),
  nonStandard: boolean("non_standard"),
});
