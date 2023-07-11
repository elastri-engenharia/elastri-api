-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT "Collaborator_userId_user_fkey";

-- AlterTable
ALTER TABLE "Collaborator" ALTER COLUMN "userId_user" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_user_fkey" FOREIGN KEY ("userId_user") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;
