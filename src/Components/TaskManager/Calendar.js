import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
const localizer = momentLocalizer(moment);

const Calendar = (props) => {
  return <BigCalendar {...props} localizer={localizer} />;
};

export default Calendar;
