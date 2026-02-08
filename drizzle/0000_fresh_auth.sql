-- Drop old auth tables (they're empty so safe to drop)
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "verification_tokens" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "verificationTokens" CASCADE;

-- Create users table matching DrizzleAdapter expectations
CREATE TABLE "users" (
    "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" text,
    "email" text NOT NULL UNIQUE,
    "emailVerified" timestamp,
    "image" text
);

-- Create accounts table matching DrizzleAdapter expectations
CREATE TABLE "accounts" (
    "userId" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "type" text NOT NULL,
    "provider" text NOT NULL,
    "providerAccountId" text NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" integer,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    PRIMARY KEY ("provider", "providerAccountId")
);

-- Create sessions table matching DrizzleAdapter expectations
CREATE TABLE "sessions" (
    "sessionToken" text PRIMARY KEY,
    "userId" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "expires" timestamp NOT NULL
);

-- Create verificationTokens table matching DrizzleAdapter expectations
CREATE TABLE "verificationTokens" (
    "identifier" text NOT NULL,
    "token" text NOT NULL,
    "expires" timestamp NOT NULL,
    PRIMARY KEY ("identifier", "token")
);

-- Create authenticators table for WebAuthn support
CREATE TABLE "authenticators" (
    "credentialID" text NOT NULL UNIQUE,
    "userId" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "providerAccountId" text NOT NULL,
    "credentialPublicKey" text NOT NULL,
    "counter" integer NOT NULL,
    "credentialDeviceType" text NOT NULL,
    "credentialBackedUp" boolean NOT NULL,
    "transports" text,
    PRIMARY KEY ("userId", "credentialID")
);
