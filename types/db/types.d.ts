import * as schema from "@/app/db/drizzle/schema";

export type SelectProduct = typeof schema.products.$inferSelect;
export type InsertProduct = typeof schema.products.$inferInsert;

export type SelectProductFreightLink =
    typeof schema.product_freight_links.$inferSelect;
export type InsertProductFreightLink =
    typeof schema.product_freight_links.$inferInsert;

export type SelectFreightClassification =
    typeof schema.freight_classifications.$inferSelect;
export type InsertFreightClassification =
    typeof schema.freight_classifications.$inferInsert;

export type SelectProductFreightLinkage =
    typeof schema.product_freight_linkages.$inferSelect;
export type InsertProductFreightLinkage =
    typeof schema.product_freight_linkages.$inferInsert;