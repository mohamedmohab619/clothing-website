ALTER TABLE "variants" RENAME COLUMN "color" TO "color_name";--> statement-breakpoint
ALTER TABLE "variants" ADD COLUMN "color_value" varchar(50) NOT NULL;