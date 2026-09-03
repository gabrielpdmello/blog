/*
  Warnings:

  - Added the required column `intro` to the `blog_post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blog_post" ADD COLUMN     "intro" TEXT NOT NULL;
