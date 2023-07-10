/*
  Warnings:

  - You are about to drop the column `construction_idConstruction` on the `Third` table. All the data in the column will be lost.
  - Added the required column `constructionId_construction` to the `Third` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Third" DROP COLUMN "construction_idConstruction",
ADD COLUMN     "constructionId_construction" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Third" ADD CONSTRAINT "Third_constructionId_construction_fkey" FOREIGN KEY ("constructionId_construction") REFERENCES "Construction"("id_construction") ON DELETE RESTRICT ON UPDATE CASCADE;
