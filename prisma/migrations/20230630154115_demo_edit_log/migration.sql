-- AlterTable
ALTER TABLE "LumaEventGuest" ADD COLUMN     "demo" TEXT;

-- CreateTable
CREATE TABLE "LumaEventGuestDemoEditLog" (
    "id" SERIAL NOT NULL,
    "lumaEventGuestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LumaEventGuestDemoEditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LumaEventGuestDemoEditLog" ADD CONSTRAINT "LumaEventGuestDemoEditLog_lumaEventGuestId_fkey" FOREIGN KEY ("lumaEventGuestId") REFERENCES "LumaEventGuest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LumaEventGuestDemoEditLog" ADD CONSTRAINT "LumaEventGuestDemoEditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
