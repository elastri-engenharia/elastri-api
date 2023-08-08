/*
  Warnings:

  - Added the required column `gender` to the `Collaborator` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- AlterTable
ALTER TABLE "Collaborator" ADD COLUMN     "gender" "Gender" NOT NULL;
