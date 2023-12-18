-- AlterTable
ALTER TABLE "pets" ALTER COLUMN "requirements" DROP NOT NULL,
ALTER COLUMN "requirements" SET DATA TYPE TEXT;
