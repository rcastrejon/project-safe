CREATE TABLE IF NOT EXISTS "assignment" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"driver_id" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"registration_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"birth_date" date NOT NULL,
	"curp" text NOT NULL,
	"address" text NOT NULL,
	"monthly_salary" integer NOT NULL,
	"license_number" text NOT NULL,
	"registration_date" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "driver_curp_unique" UNIQUE("curp"),
	CONSTRAINT "driver_license_number_unique" UNIQUE("license_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "route" (
	"id" text PRIMARY KEY NOT NULL,
	"assignment_id" text NOT NULL,
	"start_longitude" numeric(14, 11) NOT NULL,
	"start_latitude" numeric(14, 11) NOT NULL,
	"end_longitude" numeric(14, 11) NOT NULL,
	"end_latitude" numeric(14, 11) NOT NULL,
	"name" text NOT NULL,
	"drive_date" date NOT NULL,
	"success" boolean,
	"problem_description" text,
	"comments" text,
	"registration_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"hashed_password" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle" (
	"id" text PRIMARY KEY NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"vin" text NOT NULL,
	"cost" integer NOT NULL,
	"license_plate" text NOT NULL,
	"purchase_date" date NOT NULL,
	"photo_url" text NOT NULL,
	"registration_date" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehicle_vin_unique" UNIQUE("vin"),
	CONSTRAINT "vehicle_license_plate_unique" UNIQUE("license_plate")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignment" ADD CONSTRAINT "assignment_vehicle_id_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignment" ADD CONSTRAINT "assignment_driver_id_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitation" ADD CONSTRAINT "invitation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "route" ADD CONSTRAINT "route_assignment_id_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
