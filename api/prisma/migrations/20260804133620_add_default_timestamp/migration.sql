/*
  Warnings:

  - Made the column `published_at` on table `blog_post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `blog_post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "blog_post" ALTER COLUMN "published_at" SET NOT NULL,
ALTER COLUMN "published_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "comment" ALTER COLUMN "posted_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
