import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { UserDocument } from "../types/types";
import { CreateEventSchema } from "../utils/schema";
import {
  calculateDailyReminderTimes,
  calculateNextOccurrences,
} from "../utils/event";
import prisma from "../db/db";
import { ApiResponse } from "../utils/ApiResponse";

export const addEvent = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }
    const userId = (req.user as UserDocument).id;

    const validatedInput = CreateEventSchema.parse(req.body);

    const { timeRange, ...eventData } = validatedInput;

    const reminderTimes = calculateDailyReminderTimes(timeRange);

    const reminders = reminderTimes.map(({ hour, minutes }) => ({
      minutesBefore: 0,
      reminderType: "PUSH_NOTIFICATION" as const,
      reminderTime: {
        hour,
        minutes,
      },
    }));

    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        isAllDay: eventData.isAllDay,
        userId,
        isRecurring: !!eventData.recurrence,
        frequency: eventData.recurrence?.frequency,
        interval: eventData.recurrence?.interval,
        weekDays: eventData.recurrence?.weekDays
          ? JSON.stringify(eventData.recurrence.weekDays)
          : null,
        monthDays: eventData.recurrence?.monthDays
          ? JSON.stringify(eventData.recurrence.monthDays)
          : null,
        reminders: {
          create: reminders.map(({ minutesBefore, reminderType }) => ({
            minutesBefore,
            reminderType,
          })),
        },
      },
      include: {
        reminders: true,
      },
    });

    let nextOccurrences: Date[] = [];
    if (event.isRecurring && event.frequency) {
      nextOccurrences = calculateNextOccurrences(event, 5);
    }

    const enhancedReminders = event.reminders.map((reminder, index) => ({
      ...reminder,
      scheduledTime: reminderTimes[index],
    }));
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          event: {
            ...event,
            reminders: enhancedReminders,
          },
          nextOccurrences,
          reminderTimes,
        },
        "Event created"
      )
    );
  } catch (error: any) {
    throw new ApiError(400, error.message, [error.message]);
  }
});
