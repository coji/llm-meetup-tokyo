/*
  Warnings:

  - Made the column `guestCount` on table `LumaEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LumaEvent" ALTER COLUMN "guestCount" SET NOT NULL;
