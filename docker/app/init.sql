-- Grant all privileges on qadb to qauser
GRANT ALL PRIVILEGES ON DATABASE qadb TO qauser;

-- Create tables in the "qadb"
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "articles" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "comments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "articleId" UUID NOT NULL REFERENCES "articles"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_users_id" ON "users"("id");
CREATE INDEX IF NOT EXISTS "idx_articles_id" ON "articles"("id");
CREATE INDEX IF NOT EXISTS "idx_comments_id" ON "comments"("id");
