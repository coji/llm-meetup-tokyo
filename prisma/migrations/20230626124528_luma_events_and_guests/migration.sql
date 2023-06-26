/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventGuest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventGuest" DROP CONSTRAINT "EventGuest_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventGuest" DROP CONSTRAINT "EventGuest_userId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventGuest";

-- CreateTable
CREATE TABLE "LumaEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "socialImageUrl" TEXT NOT NULL,
    "registrationQuestions" JSONB[],

    CONSTRAINT "LumaEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LumaUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,

    CONSTRAINT "LumaUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LumaEventGuest" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "approvalStatus" TEXT NOT NULL,
    "registrationAnswers" JSONB[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LumaEventGuest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LumaEventGuest_eventId_userId_key" ON "LumaEventGuest"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "LumaEventGuest" ADD CONSTRAINT "LumaEventGuest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "LumaEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LumaEventGuest" ADD CONSTRAINT "LumaEventGuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "LumaUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
