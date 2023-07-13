/*
  Warnings:

  - You are about to drop the `_ServiceToSubField` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ServiceToSubField" DROP CONSTRAINT "_ServiceToSubField_A_fkey";

-- DropForeignKey
ALTER TABLE "_ServiceToSubField" DROP CONSTRAINT "_ServiceToSubField_B_fkey";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "subFieldId_subField" TEXT;

-- DropTable
DROP TABLE "_ServiceToSubField";

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_subFieldId_subField_fkey" FOREIGN KEY ("subFieldId_subField") REFERENCES "SubField"("id_subField") ON DELETE SET NULL ON UPDATE CASCADE;
