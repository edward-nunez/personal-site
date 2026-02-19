CREATE TABLE "toolkit_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"items" text[] DEFAULT '{}' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "toolkit_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "toolkit_categories_slug_idx" ON "toolkit_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "toolkit_categories_order_idx" ON "toolkit_categories" USING btree ("order");
