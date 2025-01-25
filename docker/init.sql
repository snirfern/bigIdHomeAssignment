GRANT ALL PRIVILEGES ON DATABASE devdb TO "devuser";

\c devdb;

CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE "articles" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "comments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "articleId" UUID NOT NULL REFERENCES "articles"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_users_id" ON "users"("id");
CREATE INDEX "idx_articles_id" ON "articles"("id");
CREATE INDEX "idx_comments_id" ON "comments"("id");