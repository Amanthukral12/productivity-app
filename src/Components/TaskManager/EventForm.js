import React, { useState, useEffect } from "react";
import "./styles.css";
import moment from "moment/moment";
const EventForm = ({ shown, close, event, handleSubmit }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState("daily");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(moment(event.start).format("YYYY-MM-DD"));
      setEndDate(moment(event.end).format("YYYY-MM-DD"));
      setIsRecurring(event.isRecurring || false);
      setRecurrenceFrequency(event.recurrenceFrequency || "daily");
      setRecurrenceEndDate(
        event.recurrenceEndDate
          ? moment(event.recurrenceEndDate).format("YYYY-MM-DD")
          : ""
      );
    }
  }, [event]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const eventData = {
        allDay: true,
        title: title,
        start: startDate,
        end: endDate,
        isRecurring: isRecurring,
        recurrenceFrequency: isRecurring ? recurrenceFrequency : null,
        recurrenceEndDate: isRecurring ? recurrenceEndDate : endDate,
      };
      if (event) {
        await handleSubmit({
          ...eventData,
          end: moment(endDate).endOf("day").toDate().toString(),
        });
      } else {
        await handleSubmit({
          ...eventData,
          end: moment(endDate).endOf("day").toDate().toString(),
        });
      }
      setTitle("");
      setStartDate("");
      setEndDate("");
      close();
    } catch (error) {
      setError(error.message);
    }
  };

  return shown ? (
    <div
      className="form-backdrop"
      onClick={() => {
        close();
      }}
    >
      <div
        className="form-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <form onSubmit={handleFormSubmit} className="eventForm">
          <h1 className="heading">{event ? "Update Event" : "Add Event"}</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Your Title"
            className="input"
          />
          <input
            type="date"
            value={moment(startDate).format("YYYY-MM-DD")}
            onChange={(e) => setStartDate(e.target.value)}
            className="input"
          ></input>
          <input
            type="date"
            value={moment(endDate).format("YYYY-MM-DD")}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            className="input"
          ></input>
          <div>
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => {
                setIsRecurring(!isRecurring);
              }}
            />
            <label htmlFor="isRecurring">Recurring Event</label>
          </div>
          {isRecurring && (
            <>
              <select
                value={recurrenceFrequency}
                onChange={(e) => setRecurrenceFrequency(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input
                type="date"
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
              />
            </>
          )}
          <button className="submitButton" type="submit">
            {event ? "Update" : "Submit"}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  ) : null;
};

export default EventForm;
