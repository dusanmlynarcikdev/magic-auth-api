ALTER TABLE "authentications" ADD COLUMN "last_used_at" timestamp with time zone;--> statement-breakpoint
UPDATE "authentications" SET "last_used_at" = "authenticated_at";
