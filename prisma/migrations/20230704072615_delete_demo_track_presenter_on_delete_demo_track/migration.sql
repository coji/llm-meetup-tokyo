-- DropForeignKey
ALTER TABLE "DemoTrackPresenter" DROP CONSTRAINT "DemoTrackPresenter_demoTrackId_fkey";

-- AddForeignKey
ALTER TABLE "DemoTrackPresenter" ADD CONSTRAINT "DemoTrackPresenter_demoTrackId_fkey" FOREIGN KEY ("demoTrackId") REFERENCES "DemoTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
