/*
  Warnings:

  - You are about to drop the column `userId_user` on the `Construction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Construction" DROP CONSTRAINT "Construction_userId_user_fkey";

-- AlterTable
ALTER TABLE "Construction" DROP COLUMN "userId_user";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "constructionId_construction" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_constructionId_construction_fkey" FOREIGN KEY ("constructionId_construction") REFERENCES "Construction"("id_construction") ON DELETE SET NULL ON UPDATE CASCADE;
