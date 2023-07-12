/*
  Warnings:

  - You are about to drop the column `collaboratorId_collaborator` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_collaboratorId_collaborator_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "collaboratorId_collaborator";

-- CreateTable
CREATE TABLE "_CollaboratorToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CollaboratorToService_AB_unique" ON "_CollaboratorToService"("A", "B");

-- CreateIndex
CREATE INDEX "_CollaboratorToService_B_index" ON "_CollaboratorToService"("B");

-- AddForeignKey
ALTER TABLE "_CollaboratorToService" ADD CONSTRAINT "_CollaboratorToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Collaborator"("id_collaborator") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaboratorToService" ADD CONSTRAINT "_CollaboratorToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id_service") ON DELETE CASCADE ON UPDATE CASCADE;
