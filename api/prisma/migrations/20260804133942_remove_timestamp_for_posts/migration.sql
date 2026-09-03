-- AlterTable
ALTER TABLE "blog_post" ALTER COLUMN "published_at" DROP NOT NULL,
ALTER COLUMN "published_at" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;
