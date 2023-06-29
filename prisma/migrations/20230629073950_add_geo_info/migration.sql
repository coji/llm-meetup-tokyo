/*
  Warnings:

  - Added the required column `geoAddress` to the `LumaEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geoCityState` to the `LumaEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geoPlaceId` to the `LumaEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LumaEvent" ADD COLUMN     "geoAddress" TEXT NOT NULL,
ADD COLUMN     "geoCityState" TEXT NOT NULL,
ADD COLUMN     "geoPlaceId" TEXT NOT NULL;
