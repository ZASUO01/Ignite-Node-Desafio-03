/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `orgs` will be added. If there are existing duplicate values, this will fail.
  - Made the column `responsible` on table `orgs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `orgs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orgs" ALTER COLUMN "responsible" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orgs_email_key" ON "orgs"("email");
