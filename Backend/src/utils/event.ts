import { TimeRange } from "../types/types";
import { ApiError } from "./ApiError";

export const calculateDailyReminderTimes = (timeRange: TimeRange) => {
  const { startHour, endHour, remindersPerDay } = timeRange;
  if (remindersPerDay < 1) {
    throw new ApiError(400, "Must have at least 1 reminder per day", [
      "Must have at least 1 reminder per day",
    ]);
  }
  if (startHour >= endHour) {
    throw new ApiError(400, "Start hour must be before end hour", [
      "Start hour must be before end hour",
    ]);
  }
  if (startHour < 0 || endHour > 23) {
    throw new ApiError(400, "Hours must be between 0 and 23", [
      "Hours must be between 0 and 23",
    ]);
  }
  const totalMinutes = (endHour - startHour) * 60;
  const intervalMinutes =
    remindersPerDay === 1
      ? 0
      : Math.floor(totalMinutes / (remindersPerDay - 1));

  const reminderTimes = [];

  for (let i = 0; i < remindersPerDay; i++) {
    const totalMinutesFromStart = i * intervalMinutes;
    const hour = Math.floor(startHour + totalMinutesFromStart / 60);
    const minutes = totalMinutesFromStart % 60;

    if (hour > endHour) break;

    reminderTimes.push({
      hour,
      minutes,
      formattedTime: `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
    });
  }
  return reminderTimes;
};
