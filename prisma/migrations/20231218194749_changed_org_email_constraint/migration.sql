/*
  Warnings:

  - Made the column `email` on table `orgs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orgs" ALTER COLUMN "email" SET NOT NULL;
