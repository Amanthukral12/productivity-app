import React, { useCallback, useState } from "react";
import moment from "moment/moment";
import Calendar from "./Calendar";
import { momentLocalizer } from "react-big-calendar";
const localizer = momentLocalizer(moment);
const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === "month") {
      setSelectedDate(moment(selectedDate).month(value).toDate());
    } else if (name === "year") {
      setSelectedDate(moment(selectedDate).year(value).toDate());
    }
  };
  const handleNavigate = (newDate) => {
    setSelectedDate(newDate);
  };
  return (
    <div style={{ height: "95vh" }}>
      <div>
        <select name="month" onChange={handleDateChange}>
          {moment.months().map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select name="year" onChange={handleDateChange}>
          {Array.from({ length: 10 }, (_, i) => moment().year() + i).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
      </div>
      <Calendar
        // events={events}
        localizer={localizer}
        defaultDate={selectedDate}
        date={selectedDate}
        views={["month"]}
        style={{ height: "50vh", width: "50%" }}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default MyCalendar;
