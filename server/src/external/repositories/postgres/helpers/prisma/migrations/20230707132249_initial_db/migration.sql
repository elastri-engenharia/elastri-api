-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ACCESS_ADMIN', 'ACCESS_ADMIN_RDC', 'ACCESS_ADMIN_SNACK', 'ACCESS_FUNC_RDC', 'ACCESS_FUNC_SNACK');

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Company" (
    "id_company" TEXT NOT NULL,
    "userId_user" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id_company")
);

-- CreateTable
CREATE TABLE "Construction" (
    "id_construction" TEXT NOT NULL,
    "code_construction" TEXT NOT NULL,
    "name_construction" TEXT NOT NULL,
    "userId_user" TEXT NOT NULL,
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
    "garden" TEXT NOT NULL,
    "subfield" TEXT NOT NULL,
    "foreseen" TEXT NOT NULL,
    "undMeasure" TEXT NOT NULL,
    "advance" TEXT NOT NULL,
    "constructionId_construction" TEXT NOT NULL,
    "collaboratorId_collaborator" TEXT NOT NULL,
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
CREATE TABLE "MealTime" (
    "id_mealTime" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MealTime_pkey" PRIMARY KEY ("id_mealTime")
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
CREATE TABLE "Third" (
    "id_third" TEXT NOT NULL,
    "code_third" TEXT NOT NULL,
    "name_third" TEXT NOT NULL,
    "disabled_third" BOOLEAN NOT NULL DEFAULT false,
    "construction_idConstruction" TEXT NOT NULL,

    CONSTRAINT "Third_pkey" PRIMARY KEY ("id_third")
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id_collaborator" TEXT NOT NULL,
    "matriculation" TEXT NOT NULL,
    "name_collaborator" TEXT NOT NULL,
    "office_collaborator" TEXT NOT NULL,
    "disabled_collaborator" BOOLEAN NOT NULL DEFAULT false,
    "responsible" BOOLEAN NOT NULL,
    "userId_user" TEXT NOT NULL,
    "constructionId_construction" TEXT NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id_collaborator")
);

-- CreateTable
CREATE TABLE "Snack" (
    "id_snack" TEXT NOT NULL,
    "date_snack" TIMESTAMP(3) NOT NULL,
    "type_snack" TEXT NOT NULL,
    "thirdId_third" TEXT NOT NULL,
    "collaboratorId_collaborator" TEXT NOT NULL,

    CONSTRAINT "Snack_pkey" PRIMARY KEY ("id_snack")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_company_name_key" ON "Company"("company_name");

-- CreateIndex
CREATE UNIQUE INDEX "Construction_code_construction_key" ON "Construction"("code_construction");

-- CreateIndex
CREATE UNIQUE INDEX "Service_code_service_key" ON "Service"("code_service");

-- CreateIndex
CREATE UNIQUE INDEX "Third_code_third_key" ON "Third"("code_third");

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_matriculation_key" ON "Collaborator"("matriculation");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_user_fkey" FOREIGN KEY ("userId_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Construction" ADD CONSTRAINT "Construction_userId_user_fkey" FOREIGN KEY ("userId_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Construction" ADD CONSTRAINT "Construction_companyId_company_fkey" FOREIGN KEY ("companyId_company") REFERENCES "Company"("id_company") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_constructionId_construction_fkey" FOREIGN KEY ("constructionId_construction") REFERENCES "Construction"("id_construction") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_collaboratorId_collaborator_fkey" FOREIGN KEY ("collaboratorId_collaborator") REFERENCES "Collaborator"("id_collaborator") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_userId_user_fkey" FOREIGN KEY ("userId_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_serviceId_service_fkey" FOREIGN KEY ("serviceId_service") REFERENCES "Service"("id_service") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_user_fkey" FOREIGN KEY ("userId_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_constructionId_construction_fkey" FOREIGN KEY ("constructionId_construction") REFERENCES "Construction"("id_construction") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snack" ADD CONSTRAINT "Snack_thirdId_third_fkey" FOREIGN KEY ("thirdId_third") REFERENCES "Third"("id_third") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snack" ADD CONSTRAINT "Snack_collaboratorId_collaborator_fkey" FOREIGN KEY ("collaboratorId_collaborator") REFERENCES "Collaborator"("id_collaborator") ON DELETE RESTRICT ON UPDATE CASCADE;
