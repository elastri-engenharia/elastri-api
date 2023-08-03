-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ACCESS_ADMIN', 'ACCESS_ADMIN_RDC', 'ACCESS_FUNC_RDC');

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "constructionId_construction" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Construction" (
    "id_construction" TEXT NOT NULL,
    "code_construction" TEXT NOT NULL,
    "name_construction" TEXT NOT NULL,
    "companyId_company" TEXT NOT NULL,

    CONSTRAINT "Construction_pkey" PRIMARY KEY ("id_construction")
);

-- CreateTable
CREATE TABLE "Garden" (
    "id_garden" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Garden_pkey" PRIMARY KEY ("id_garden")
);

-- CreateTable
CREATE TABLE "SubField" (
    "id_subField" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SubField_pkey" PRIMARY KEY ("id_subField")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id_measurement" TEXT NOT NULL,
    "name_measurement" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id_measurement")
);

-- CreateTable
CREATE TABLE "Service" (
    "id_service" TEXT NOT NULL,
    "code_service" TEXT NOT NULL,
    "name_service" TEXT NOT NULL,
    "code_totvs" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "gardenId_garden" TEXT NOT NULL,
    "measurementId_measurement" TEXT NOT NULL,
    "subFieldId_subField" TEXT,
    "foreseen" TEXT NOT NULL,
    "advance" TEXT NOT NULL,
    "constructionId_construction" TEXT NOT NULL,
    "disabled_service" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id_service")
);

-- CreateTable
CREATE TABLE "Production" (
    "id_production" TEXT NOT NULL,
    "performed_production" TEXT NOT NULL,
    "date_production" TEXT NOT NULL,
    "note" TEXT,
    "photograph" TEXT NOT NULL,
    "userId_user" TEXT NOT NULL,
    "serviceId_service" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Production_pkey" PRIMARY KEY ("id_production")
);

-- CreateTable
CREATE TABLE "MonitoringUnit" (
    "id_monitoringUnit" TEXT NOT NULL,
    "code_monitoring" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "MonitoringUnit_pkey" PRIMARY KEY ("id_monitoringUnit")
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id_collaborator" TEXT NOT NULL,
    "matriculation" TEXT NOT NULL,
    "name_collaborator" TEXT NOT NULL,
    "office_collaborator" TEXT NOT NULL,
    "disabled_collaborator" BOOLEAN NOT NULL DEFAULT false,
    "responsible" BOOLEAN NOT NULL,
    "admission_date" TEXT NOT NULL DEFAULT '0000-00-00',
    "resignation_date" TEXT,
    "userId_user" TEXT,
    "constructionId_construction" TEXT NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id_collaborator")
);

-- CreateTable
CREATE TABLE "_CollaboratorToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Construction_code_construction_key" ON "Construction"("code_construction");

-- CreateIndex
CREATE UNIQUE INDEX "Service_code_service_key" ON "Service"("code_service");

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_matriculation_key" ON "Collaborator"("matriculation");

-- CreateIndex
CREATE UNIQUE INDEX "_CollaboratorToService_AB_unique" ON "_CollaboratorToService"("A", "B");

-- CreateIndex
CREATE INDEX "_CollaboratorToService_B_index" ON "_CollaboratorToService"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_constructionId_construction_fkey" FOREIGN KEY ("constructionId_construction") REFERENCES "Construction"("id_construction") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_subFieldId_subField_fkey" FOREIGN KEY ("subFieldId_subField") REFERENCES "SubField"("id_subField") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_gardenId_garden_fkey" FOREIGN KEY ("gardenId_garden") REFERENCES "Garden"("id_garden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_measurementId_measurement_fkey" FOREIGN KEY ("measurementId_measurement") REFERENCES "Measurement"("id_measurement") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_constructionId_construction_fkey" FOREIGN KEY ("constructionId_construction") REFERENCES "Construction"("id_construction") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_userId_user_fkey" FOREIGN KEY ("userId_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_serviceId_service_fkey" FOREIGN KEY ("serviceId_service") REFERENCES "Service"("id_service") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_user_fkey" FOREIGN KEY ("userId_user") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_constructionId_construction_fkey" FOREIGN KEY ("constructionId_construction") REFERENCES "Construction"("id_construction") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaboratorToService" ADD CONSTRAINT "_CollaboratorToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Collaborator"("id_collaborator") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaboratorToService" ADD CONSTRAINT "_CollaboratorToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id_service") ON DELETE CASCADE ON UPDATE CASCADE;
