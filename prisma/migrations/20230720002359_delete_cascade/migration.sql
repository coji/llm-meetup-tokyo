-- DropForeignKey
ALTER TABLE "DemoTrack" DROP CONSTRAINT "DemoTrack_currentPresenterId_fkey";

-- DropForeignKey
ALTER TABLE "DemoTrack" DROP CONSTRAINT "DemoTrack_eventId_fkey";

-- DropForeignKey
ALTER TABLE "DemoTrack" DROP CONSTRAINT "DemoTrack_hostId_fkey";

-- DropForeignKey
ALTER TABLE "DemoTrackPresenter" DROP CONSTRAINT "DemoTrackPresenter_presenterId_fkey";

-- DropForeignKey
ALTER TABLE "LumaCrawlJob" DROP CONSTRAINT "LumaCrawlJob_eventId_fkey";

-- DropForeignKey
ALTER TABLE "LumaEventGuest" DROP CONSTRAINT "LumaEventGuest_eventId_fkey";

-- DropForeignKey
ALTER TABLE "LumaEventGuest" DROP CONSTRAINT "LumaEventGuest_userId_fkey";

-- DropForeignKey
ALTER TABLE "LumaEventGuestDemoEditLog" DROP CONSTRAINT "LumaEventGuestDemoEditLog_lumaEventGuestId_fkey";

-- DropForeignKey
ALTER TABLE "LumaEventGuestDemoEditLog" DROP CONSTRAINT "LumaEventGuestDemoEditLog_userId_fkey";

-- AddForeignKey
ALTER TABLE "LumaEventGuest" ADD CONSTRAINT "LumaEventGuest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "LumaEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LumaEventGuest" ADD CONSTRAINT "LumaEventGuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "LumaUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LumaEventGuestDemoEditLog" ADD CONSTRAINT "LumaEventGuestDemoEditLog_lumaEventGuestId_fkey" FOREIGN KEY ("lumaEventGuestId") REFERENCES "LumaEventGuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LumaEventGuestDemoEditLog" ADD CONSTRAINT "LumaEventGuestDemoEditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LumaCrawlJob" ADD CONSTRAINT "LumaCrawlJob_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "LumaEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoTrack" ADD CONSTRAINT "DemoTrack_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "LumaEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoTrack" ADD CONSTRAINT "DemoTrack_currentPresenterId_fkey" FOREIGN KEY ("currentPresenterId") REFERENCES "LumaEventGuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoTrack" ADD CONSTRAINT "DemoTrack_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "LumaEventGuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoTrackPresenter" ADD CONSTRAINT "DemoTrackPresenter_presenterId_fkey" FOREIGN KEY ("presenterId") REFERENCES "LumaEventGuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
