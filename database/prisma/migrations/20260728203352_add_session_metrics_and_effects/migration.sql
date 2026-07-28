/*
  Warnings:

  - Added the required column `category` to the `Effect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Metric` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MetricCategory" AS ENUM ('PAIN', 'MENTAL', 'SLEEP', 'DIGESTIVE', 'ENERGY', 'MOOD', 'OTHER');

-- CreateEnum
CREATE TYPE "EffectCategory" AS ENUM ('POSITIVE', 'NEGATIVE', 'COGNITIVE', 'PHYSICAL', 'SOCIAL', 'OTHER');

-- AlterTable
ALTER TABLE "Effect" ADD COLUMN     "category" "EffectCategory" NOT NULL,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "category" "MetricCategory" NOT NULL,
ADD COLUMN     "description" TEXT;
