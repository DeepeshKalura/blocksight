ALTER TABLE "waitlist" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "waitlist" CASCADE;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'user_dapps'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "user_dapps" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "user_dapps" ALTER COLUMN "id" DROP NOT NULL;