import { pgTable, unique, serial, varchar, text, uuid, foreignKey, integer, numeric, boolean } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const products = pgTable("products", {
	product_id: serial("product_id").primaryKey().notNull(),
	sku: varchar("sku", { length: 255 }).notNull(),
	name: text("name").notNull(),
	packaging_type: varchar("packaging_type", { length: 255 }),
	unit_container_type: varchar("unit_container_type", { length: 255 }),
	objectID: uuid("objectID").defaultRandom(),
},
(table) => {
	return {
		products_sku_key: unique("products_sku_key").on(table.sku),
	}
});

export const product_freight_links = pgTable("product_freight_links", {
	link_id: serial("link_id").primaryKey().notNull(),
	product_id: integer("product_id").references(() => products.product_id),
	classification_id: integer("classification_id").references(() => freight_classifications.classification_id),
	object_id: uuid("object_id").defaultRandom(),
});

export const freight_classifications = pgTable("freight_classifications", {
	classification_id: serial("classification_id").primaryKey().notNull(),
	description: text("description"),
	nmfc: varchar("nmfc", { length: 255 }),
	freight_class: numeric("freight_class"),
	hazardous: boolean("hazardous"),
	hazard_id: varchar("hazard_id", { length: 255 }),
	packing_group: varchar("packing_group", { length: 255 }),
	sub: varchar("sub", { length: 255 }),
	hazard_class: varchar("hazard_class", { length: 255 }),
});

export const product_freight_linkages = pgTable("product_freight_linkages", {
	product_id: integer("product_id"),
	sku: varchar("sku", { length: 255 }),
	name: text("name"),
	packaging_type: varchar("packaging_type", { length: 255 }),
	unit_container_type: varchar("unit_container_type", { length: 255 }),
	classification_id: integer("classification_id"),
	link_id: integer("link_id"),
	object_id: uuid("object_id"),
});