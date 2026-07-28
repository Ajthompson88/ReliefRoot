-- AlterTable
ALTER TABLE "Effect" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;
