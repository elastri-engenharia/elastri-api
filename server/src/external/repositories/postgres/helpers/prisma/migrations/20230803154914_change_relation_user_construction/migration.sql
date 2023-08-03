/*
  Warnings:

  - You are about to drop the column `constructionId_construction` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_constructionId_construction_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "constructionId_construction";

-- CreateTable
CREATE TABLE "_ConstructionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConstructionToUser_AB_unique" ON "_ConstructionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ConstructionToUser_B_index" ON "_ConstructionToUser"("B");

-- AddForeignKey
ALTER TABLE "_ConstructionToUser" ADD CONSTRAINT "_ConstructionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Construction"("id_construction") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConstructionToUser" ADD CONSTRAINT "_ConstructionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
