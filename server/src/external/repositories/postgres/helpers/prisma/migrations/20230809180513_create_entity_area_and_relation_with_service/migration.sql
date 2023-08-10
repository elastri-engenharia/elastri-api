-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "areaId_area" TEXT;

-- CreateTable
CREATE TABLE "Area" (
    "id_area" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id_area")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_areaId_area_fkey" FOREIGN KEY ("areaId_area") REFERENCES "Area"("id_area") ON DELETE SET NULL ON UPDATE CASCADE;
