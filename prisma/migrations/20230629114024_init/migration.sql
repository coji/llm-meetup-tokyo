-- CreateEnum
CREATE TYPE "LumaCrawlState" AS ENUM ('CREATED', 'RUNNING', 'DONE', 'ERROR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "discriminator" TEXT NOT NULL,
    "email" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LumaEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "geoAddress" TEXT NOT NULL,
    "geoCityState" TEXT NOT NULL,
    "geoPlaceId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "socialImageUrl" TEXT NOT NULL,
    "registrationQuestions" JSONB NOT NULL,
    "guestCount" INTEGER NOT NULL,

    CONSTRAINT "LumaEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LumaUser" (
    "id" TEXT NOT NULL,
    "name" TEXT,
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
    "registrationAnswers" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LumaEventGuest_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LumaEventGuest_eventId_userId_key" ON "LumaEventGuest"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");

-- AddForeignKey
ALTER TABLE "LumaEventGuest" ADD CONSTRAINT "LumaEventGuest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "LumaEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LumaEventGuest" ADD CONSTRAINT "LumaEventGuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "LumaUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LumaCrawlJob" ADD CONSTRAINT "LumaCrawlJob_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "LumaEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
