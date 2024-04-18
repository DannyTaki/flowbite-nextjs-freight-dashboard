-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"sku" varchar(255) NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "products_sku_key" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_freight_links" (
	"link_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"classification_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "freight_classifications" (
	"classification_id" serial PRIMARY KEY NOT NULL,
	"description" text,
	"mode" varchar(255),
	"package" varchar(255),
	"declared_value" numeric,
	"weight" numeric,
	"height" numeric,
	"length" numeric,
	"width" numeric,
	"stackable" boolean,
	"pieces" integer,
	"nmfc" varchar(255),
	"freight_class" numeric NOT NULL,
	"hazardous" boolean,
	"hazard" varchar(255),
	"said_to_contain" varchar(255),
	"said_to_contain_packaging_type" varchar(255),
	"non_standard" boolean
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_freight_links" ADD CONSTRAINT "product_freight_links_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_freight_links" ADD CONSTRAINT "product_freight_links_classification_id_fkey" FOREIGN KEY ("classification_id") REFERENCES "public"."freight_classifications"("classification_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/