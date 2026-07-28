/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Cultivar` table. All the data in the column will be lost.
  - Added the required column `acquisitionType` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cultivar" DROP CONSTRAINT "Cultivar_organizationId_fkey";

-- DropIndex
DROP INDEX "Cultivar_organizationId_idx";

-- DropIndex
DROP INDEX "Cultivar_organizationId_name_key";

-- AlterTable
ALTER TABLE "Cultivar" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "acquisitionType" "AcquisitionType" NOT NULL,
ADD COLUMN     "batchNumber" TEXT,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "cbdPercent" DECIMAL(65,30),
ADD COLUMN     "cbgPercent" DECIMAL(65,30),
ADD COLUMN     "cbnPercent" DECIMAL(65,30),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "productType" "ProductType" NOT NULL,
ADD COLUMN     "thcPercent" DECIMAL(65,30),
ADD COLUMN     "weight" DECIMAL(65,30);
