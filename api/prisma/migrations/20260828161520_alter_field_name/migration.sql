/*
  Warnings:

  - You are about to drop the column `posted_at` on the `comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comment" DROP COLUMN "posted_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
