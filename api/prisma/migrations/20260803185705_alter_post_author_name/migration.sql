/*
  Warnings:

  - You are about to drop the column `user_id` on the `blog_post` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `blog_post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blog_post" DROP COLUMN "user_id",
ADD COLUMN     "author_id" INTEGER NOT NULL;
