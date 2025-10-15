-- Drop tables in reverse order of dependency to avoid foreign key constraints errors
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "websites" CASCADE;
DROP TABLE IF EXISTS "cases" CASCADE;
DROP TABLE IF EXISTS "customers" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "app_settings" CASCADE;

-- Create users table
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "avatar" VARCHAR(255),
  "role" VARCHAR(50) NOT NULL CHECK ("role" IN ('agent', 'admin')),
  "status" VARCHAR(50) NOT NULL CHECK ("status" IN ('online', 'offline')),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create customers table
CREATE TABLE "customers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "avatar" VARCHAR(255),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create cases table
CREATE TABLE "cases" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "customer_id" UUID NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "status" VARCHAR(50) NOT NULL CHECK ("status" IN ('open', 'in-progress', 'resolved')),
  "summary" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create messages table
CREATE TABLE "messages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "case_id" UUID NOT NULL REFERENCES "cases"("id") ON DELETE CASCADE,
  "sender_type" VARCHAR(50) NOT NULL CHECK ("sender_type" IN ('user', 'agent', 'system')),
  "content" TEXT NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
  "customer_id" UUID REFERENCES "customers"("id") ON DELETE SET NULL
);

-- Create websites table
CREATE TABLE "websites" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create app_settings table
CREATE TABLE "app_settings" (
    "id" SERIAL PRIMARY KEY,
    "primary_color" VARCHAR(20) NOT NULL DEFAULT '#64B5F6',
    "welcome_message" TEXT NOT NULL DEFAULT '您好！我们能为您做些什么？',
    "offline_message" TEXT NOT NULL DEFAULT '我们目前不在。请留言，我们会尽快回复您。',
    "accept_new_chats" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for foreign keys to improve performance
CREATE INDEX ON "cases" ("customer_id");
CREATE INDEX ON "messages" ("case_id");
CREATE INDEX ON "messages" ("user_id");
CREATE INDEX ON "messages" ("customer_id");
CREATE INDEX ON "websites" ("user_id");
