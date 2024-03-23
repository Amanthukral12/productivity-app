import React, { useState, useEffect } from "react";
import "./styles.css";
import moment from "moment/moment";
const EventForm = ({ shown, close, event, handleSubmit }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(moment(event.start).format("YYYY-MM-DD"));
      setEndDate(moment(event.end).format("YYYY-MM-DD"));
    }
  }, [event]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (event) {
        await handleSubmit({
          allDay: true,
          title: title,
          start: startDate,
          end: endDate,
        });
      } else {
        await handleSubmit({
          allDay: true,
          end: endDate,
          start: startDate,
          title: title,
        });
      }
      setTitle("");
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
              console.log(e.target.value);
              setEndDate(e.target.value);
            }}
            className="input"
          ></input>
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
