ALTER TABLE "product_images" DROP CONSTRAINT "product_images_variant_id_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "color_name" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" DROP COLUMN "variant_id";