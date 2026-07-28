-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('FLOWER', 'EDIBLE', 'CONCENTRATE', 'TINCTURE', 'TOPICAL', 'CAPSULE');

-- CreateEnum
CREATE TYPE "AcquisitionType" AS ENUM ('PURCHASED', 'HOMEGROWN');

-- CreateEnum
CREATE TYPE "SessionMethod" AS ENUM ('SMOKE', 'VAPE', 'EDIBLE', 'DAB', 'TINCTURE');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
