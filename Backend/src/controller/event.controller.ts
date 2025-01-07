import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { UserDocument } from "../types/types";
import { EventSchema } from "../utils/schema";
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

    const validatedInput = EventSchema.parse(req.body);

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
export const getAllEventsForMonth = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }
    const userId = (req.user as UserDocument).id;

    const { month, year } = req.query;

    const monthNum = parseInt(month as string);
    const yearNum = parseInt(year as string);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      throw new ApiError(400, "Invalid month or year", [
        "Invalid month or year",
      ]);
    }

    const startOfMonth = new Date(yearNum, monthNum - 1, 1);
    const endOfMonth = new Date(yearNum, monthNum, 0);

    const events = await prisma.event.findMany({
      where: {
        userId,
        OR: [
          {
            isRecurring: false,
            AND: [
              { startDate: { lte: endOfMonth } },
              { endDate: { gte: startOfMonth } },
            ],
          },
          {
            isRecurring: true,
            AND: [
              { startDate: { lte: endOfMonth } },
              {
                OR: [{ endDate: null }, { endDate: { gte: startOfMonth } }],
              },
            ],
          },
        ],
      },
      include: { reminders: true },
      orderBy: {
        startDate: "asc",
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { events }, "All occurrences fetched"));
  }
);

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again.",
    ]);
  }
  const userId = (req.user as UserDocument).id;
  const { eventId } = req.params;

  const eventExists = await prisma.event.findFirst({
    where: {
      id: Number(eventId),
      userId,
    },
  });

  if (!eventExists) {
    throw new ApiError(404, "Event not found", ["Event not found"]);
  }

  await prisma.event.delete({
    where: {
      id: Number(eventExists.id),
      userId,
    },
  });

  return res.status(200).json(new ApiResponse(200, {}, "Event Deleted"));
});

export const getEventById = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }
    const userId = (req.user as UserDocument).id;
    const { eventId } = req.params;

    const eventExists = await prisma.event.findFirst({
      where: {
        id: Number(eventId),
        userId,
      },
      include: {
        reminders: true,
      },
    });

    if (!eventExists) {
      throw new ApiError(404, "Event not found", ["Event not found"]);
    }
    return res
      .status(200)
      .json(new ApiResponse(200, eventExists, "Event found"));
  }
);

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again.",
    ]);
  }
  const userId = (req.user as UserDocument).id;
  const { eventId } = req.params;

  const eventExists = await prisma.event.findFirst({
    where: {
      id: Number(eventId),
      userId,
    },
  });

  if (!eventExists) {
    throw new ApiError(404, "Event not found", ["Event not found"]);
  }

  const validatedInput = EventSchema.parse(req.body);

  const { timeRange, ...eventData } = validatedInput;

  let reminders: any[] = [];
  if (timeRange) {
    const reminderTimes = calculateDailyReminderTimes(timeRange);
    reminders = reminderTimes.map(({ hour, minutes, formattedTime }) => ({
      minutesBefore: 0,
      reminderType: "PUSH_NOTIFICATION" as const,
      reminderHour: hour,
      reminderMinute: minutes,
    }));
  }

  if (!eventData.endDate) {
    eventData.endDate = new Date(eventData.startDate);
    eventData.endDate.setFullYear(eventData.endDate.getFullYear() + 1);
  }

  const updateData: any = {
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
  };

  const updatedEvent = await prisma.$transaction(async (prisma) => {
    if (timeRange) {
      await prisma.eventReminder.deleteMany({
        where: {
          eventId: Number(eventId),
        },
      });
    }
    const event = await prisma.event.update({
      where: {
        id: Number(eventId),
        userId,
      },
      data: {
        ...updateData,
        reminders: timeRange ? { create: reminders } : undefined,
      },
      include: {
        reminders: true,
      },
    });
    return event;
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { event: updatedEvent },
        "Event updated successfully"
      )
    );
});
