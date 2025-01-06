-- AlterTable
ALTER TABLE "EventReminder" ADD COLUMN     "reminderHour" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reminderMinute" INTEGER NOT NULL DEFAULT 0;
