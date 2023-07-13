/*
  Warnings:

  - You are about to drop the column `subFieldId_subField` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_subFieldId_subField_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "subFieldId_subField";

-- CreateTable
CREATE TABLE "_ServiceToSubField" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceToSubField_AB_unique" ON "_ServiceToSubField"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceToSubField_B_index" ON "_ServiceToSubField"("B");

-- AddForeignKey
ALTER TABLE "_ServiceToSubField" ADD CONSTRAINT "_ServiceToSubField_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id_service") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToSubField" ADD CONSTRAINT "_ServiceToSubField_B_fkey" FOREIGN KEY ("B") REFERENCES "SubField"("id_subField") ON DELETE CASCADE ON UPDATE CASCADE;
