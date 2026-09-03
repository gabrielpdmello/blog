/*
  Warnings:

  - Added the required column `post_id` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "post_id" INTEGER NOT NULL;
