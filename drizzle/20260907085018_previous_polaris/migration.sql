CREATE TABLE "authentications" (
	"id" uuid PRIMARY KEY,
	"user_external_id" varchar NOT NULL,
	"magic_token" varchar UNIQUE,
	"token" varchar UNIQUE,
	"authenticated_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "authentications_user_external_id_index" ON "authentications" ("user_external_id");
--> statement-breakpoint
CREATE INDEX "authentications_expires_at_index" ON "authentications" ("expires_at");
