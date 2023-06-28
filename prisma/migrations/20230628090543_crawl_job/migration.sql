/*
  Warnings:

  - Changed the type of `registrationQuestions` on the `LumaEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `registrationAnswers` on the `LumaEventGuest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LumaCrawlState" AS ENUM ('CREATED', 'RUNNING', 'DONE', 'ERROR');

-- AlterTable
ALTER TABLE "LumaEvent" DROP COLUMN "registrationQuestions",
ADD COLUMN     "registrationQuestions" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "LumaEventGuest" DROP COLUMN "registrationAnswers",
ADD COLUMN     "registrationAnswers" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "LumaUser" ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "LumaCrawlJob" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "status" "LumaCrawlState" NOT NULL DEFAULT 'CREATED',
    "logs" JSONB[],
    "error" TEXT,
    "eventId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LumaCrawlJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LumaCrawlJob" ADD CONSTRAINT "LumaCrawlJob_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "LumaEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
