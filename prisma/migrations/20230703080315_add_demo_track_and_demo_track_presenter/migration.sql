-- CreateTable
CREATE TABLE "DemoTrack" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "currentPresenterId" TEXT,
    "hostId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zoomUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoTrackPresenter" (
    "id" SERIAL NOT NULL,
    "demoTrackId" INTEGER NOT NULL,
    "presenterId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoTrackPresenter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DemoTrack" ADD CONSTRAINT "DemoTrack_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "LumaEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoTrack" ADD CONSTRAINT "DemoTrack_currentPresenterId_fkey" FOREIGN KEY ("currentPresenterId") REFERENCES "LumaEventGuest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoTrack" ADD CONSTRAINT "DemoTrack_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "LumaEventGuest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoTrackPresenter" ADD CONSTRAINT "DemoTrackPresenter_demoTrackId_fkey" FOREIGN KEY ("demoTrackId") REFERENCES "DemoTrack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoTrackPresenter" ADD CONSTRAINT "DemoTrackPresenter_presenterId_fkey" FOREIGN KEY ("presenterId") REFERENCES "LumaEventGuest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
