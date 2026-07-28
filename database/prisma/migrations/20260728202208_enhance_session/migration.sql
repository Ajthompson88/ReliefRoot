/*
  Warnings:

  - Added the required column `startedAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_productId_fkey";

-- DropIndex
DROP INDEX "Session_organizationId_idx";

-- DropIndex
DROP INDEX "Session_productId_idx";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "doseAmount" DECIMAL(65,30),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
