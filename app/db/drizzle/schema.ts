import { pgTable, unique, serial, varchar, text, foreignKey, integer, numeric, boolean } from "drizzle-orm/pg-core"
import { sql, type InferSelectModel } from "drizzle-orm"



export const products = pgTable("products", {
	product_id: serial("product_id").primaryKey().notNull(),
	sku: varchar("sku", { length: 255 }).notNull(),
	name: text("name").notNull(),
	packaging_type: varchar("packaging_type", { length: 255 }),
	unit_container_type: varchar("unit_container_type", { length: 255 }),
},
(table) => {
	return {
		products_sku_key: unique("products_sku_key").on(table.sku),
	}
});

export type SelectProduct = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const product_freight_links = pgTable("product_freight_links", {
	link_id: serial("link_id").primaryKey().notNull(),
	product_id: integer("product_id").notNull().references(() => products.product_id),
	classification_id: integer("classification_id").notNull().references(() => freight_classifications.classification_id),
});

export type SelectProductFreightLink = typeof product_freight_links.$inferSelect;
export type InsertProductFreightLink = typeof product_freight_links.$inferInsert; 

export const freight_classifications = pgTable("freight_classifications", {
	classification_id: serial("classification_id").primaryKey().notNull(),
	description: text("description"),
	nmfc: varchar("nmfc", { length: 255 }),
	freight_class: numeric("freight_class"),
	hazardous: boolean("hazardous"),
	hazard_id: varchar("hazard_id", { length: 255 }),
	packing_group: varchar("packing_group", { length: 255 }),
	sub: varchar("sub", { length: 255 }),
});

export type SelectFreightClassification = typeof freight_classifications.$inferSelect;
export type InsertFreightClassification = typeof freight_classifications.$inferInsert;