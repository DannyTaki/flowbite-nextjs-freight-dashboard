import { pgTable, unique, serial, varchar, text, foreignKey, integer, boolean, numeric } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const products = pgTable("products", {
	productId: serial("product_id").primaryKey().notNull(),
	sku: varchar("sku", { length: 255 }).notNull(),
	name: text("name").notNull(),
	packagingType: varchar("packaging_type", { length: 255 }),
	unitContainerType: varchar("unit_container_type", { length: 255 }),
},
(table) => {
	return {
		productsSkuKey: unique("products_sku_key").on(table.sku),
	}
});

export const productFreightLinks = pgTable("product_freight_links", {
	linkId: serial("link_id").primaryKey().notNull(),
	productId: integer("product_id").notNull().references(() => products.productId),
	classificationId: integer("classification_id").notNull().references(() => freightClassifications.classificationId),
});

export const freightClassifications = pgTable("freight_classifications", {
	classificationId: serial("classification_id").primaryKey().notNull(),
	description: text("description"),
	mode: varchar("mode", { length: 255 }),
	stackable: boolean("stackable"),
	nmfc: varchar("nmfc", { length: 255 }),
	freightClass: numeric("freight_class").notNull(),
	hazardous: boolean("hazardous"),
	hazardId: varchar("hazard_id", { length: 255 }),
	nonStandard: boolean("non_standard"),
	packingGroup: varchar("packing_group", { length: 255 }),
});