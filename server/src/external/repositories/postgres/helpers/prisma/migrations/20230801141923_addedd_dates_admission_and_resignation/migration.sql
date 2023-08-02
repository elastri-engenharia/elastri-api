-- AlterTable
ALTER TABLE "Collaborator" ADD COLUMN     "admission_date" TEXT NOT NULL DEFAULT '00/00/0000',
ADD COLUMN     "resignation_date" TEXT;
