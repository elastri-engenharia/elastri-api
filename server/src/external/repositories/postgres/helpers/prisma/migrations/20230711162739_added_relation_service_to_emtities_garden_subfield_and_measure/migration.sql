/*
  Warnings:

  - You are about to drop the column `garden` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `subfield` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `undMeasure` on the `Service` table. All the data in the column will be lost.
  - Added the required column `gardenId_garden` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurementId_measurement` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "garden",
DROP COLUMN "subfield",
DROP COLUMN "undMeasure",
ADD COLUMN     "gardenId_garden" TEXT NOT NULL,
ADD COLUMN     "measurementId_measurement" TEXT NOT NULL,
ADD COLUMN     "subFieldId_subField" TEXT;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_gardenId_garden_fkey" FOREIGN KEY ("gardenId_garden") REFERENCES "Garden"("id_garden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_subFieldId_subField_fkey" FOREIGN KEY ("subFieldId_subField") REFERENCES "SubField"("id_subField") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_measurementId_measurement_fkey" FOREIGN KEY ("measurementId_measurement") REFERENCES "Measurement"("id_measurement") ON DELETE RESTRICT ON UPDATE CASCADE;
