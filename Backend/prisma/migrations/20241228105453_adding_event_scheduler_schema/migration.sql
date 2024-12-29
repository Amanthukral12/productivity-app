-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('PUSH_NOTIFICATION', 'IN_APP');

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "frequency" "Frequency",
    "interval" INTEGER,
    "weekDays" TEXT,
    "monthDays" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventReminder" (
    "id" SERIAL NOT NULL,
    "minutesBefore" INTEGER NOT NULL,
    "reminderType" "ReminderType" NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_userId_idx" ON "Event"("userId");

-- CreateIndex
CREATE INDEX "EventReminder_eventId_idx" ON "EventReminder"("eventId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReminder" ADD CONSTRAINT "EventReminder_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
