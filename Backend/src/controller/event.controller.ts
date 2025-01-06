import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { UserDocument } from "../types/types";
import { CreateEventSchema } from "../utils/schema";
import { calculateDailyReminderTimes } from "../utils/event";
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

    const reminders = reminderTimes.map(({ hour, minutes, formattedTime }) => ({
      minutesBefore: 0,
      reminderType: "PUSH_NOTIFICATION" as const,
      reminderTime: {
        hour,
        minutes,
        formattedTime,
      },
    }));

    if (!eventData.endDate) {
      eventData.endDate = new Date(eventData.startDate);
      eventData.endDate.setFullYear(eventData.endDate.getFullYear() + 1);
    }

    console.log(reminders);

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
          create: reminders.map(
            ({ minutesBefore, reminderType, reminderTime }) => ({
              minutesBefore,
              reminderType,
              reminderHour: reminderTime.hour,
              reminderMinute: reminderTime.minutes,
            })
          ),
        },
      },
      include: {
        reminders: true,
      },
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          event,
        },
        "Event created"
      )
    );
  } catch (error: any) {
    throw new ApiError(400, error.message, [error.message]);
  }
});
export const getAllEvents = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized Access. Please login again.", [
          "Unauthorized Access. Please login again.",
        ]);
      }
      const userId = (req.user as UserDocument).id;

      const events = await prisma.event.findMany({
        where: { userId },
        include: { reminders: true },
      });

      return res
        .status(200)
        .json(new ApiResponse(200, { events }, "All occurrences fetched"));
    } catch (error: any) {
      throw new ApiError(400, error.message, [error.message]);
    }
  }
);
