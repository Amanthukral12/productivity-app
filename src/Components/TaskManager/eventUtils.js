import moment from "moment";

export const expandRecurringEvent = (event, rangeStart, rangeEnd) => {
  if (!event.isRecurring) {
    return [event];
  }

  const { start, end, recurrenceFrequency, recurrenceEndDate } = event;
  const events = [];
  let currentStart = moment(start);
  let currentEnd = moment(end);
  const eventEnd = recurrenceEndDate ? moment(recurrenceEndDate) : rangeEnd;
  while (
    currentStart.isSameOrBefore(eventEnd) &&
    currentStart.isSameOrBefore(rangeEnd)
  ) {
    if (currentEnd.isSameOrAfter(rangeStart)) {
      events.push({
        ...event,
        start: currentStart.toDate(),
        end: currentEnd.toDate(),
      });
    }
    // eslint-disable-next-line default-case
    switch (recurrenceFrequency) {
      case "daily":
        currentStart.add(1, "day");
        currentEnd.add(1, "day");
        break;
      case "weekly":
        currentStart.add(1, "week");
        currentEnd.add(1, "week");
        break;
      case "monthly":
        currentStart.add(1, "month");
        currentEnd.add(1, "month");
        break;
    }
  }
  return events;
};
