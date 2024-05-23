import { relations } from "drizzle-orm/relations";
import { products, product_freight_links, freight_classifications } from "./schema";

export const product_freight_linksRelations = relations(product_freight_links, ({one}) => ({
	product: one(products, {
		fields: [product_freight_links.product_id],
		references: [products.product_id]
	}),
	freight_classification: one(freight_classifications, {
		fields: [product_freight_links.classification_id],
		references: [freight_classifications.classification_id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	product_freight_links: many(product_freight_links),
}));

export const freight_classificationsRelations = relations(freight_classifications, ({many}) => ({
	product_freight_links: many(product_freight_links),
}));