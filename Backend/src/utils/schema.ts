import { z } from "zod";

const TimeRangeSchema = z.object({
  startHour: z.number().min(0).max(23),
  endHour: z.number().min(0).max(23),
  remindersPerDay: z.number().min(1),
});

const ReminderSchema = z.object({
  minutesBefore: z.number().min(0),
  type: z.enum(["PUSH_NOTIFICATION", "IN_APP"]),
  reminderHour: z.number().min(0).max(23),
  reminderMinute: z.number().min(0).max(59),
});

const RecurrenceSchema = z.object({
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  interval: z.number().min(1).optional(),
  weekDays: z.array(z.number().min(0).max(6)).optional(),
  monthDays: z.array(z.number().min(1).max(31)).optional(),
});

export const EventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  isAllDay: z.boolean().default(false),
  timeRange: TimeRangeSchema,
  recurrence: RecurrenceSchema.optional(),
  reminders: z.array(ReminderSchema).optional(),
});
