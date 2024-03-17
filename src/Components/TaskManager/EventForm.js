import React, { useState } from "react";
import "./styles.css";
import { firestore } from "../../firebase";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
const EventForm = ({ shown, close }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const userEventsCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/eventReminder`
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addDoc(userEventsCollectionRef, {
        allDay: true,
        end: endDate,
        start: startDate,
        timestamp: serverTimestamp(),
        title: title,
      });
      setTitle("");
      setStartDate("");
      setEndDate("");
      close();
    } catch (error) {
      setError(error);
    }
  };
  return shown ? (
    <div
      className="sidebar-backdrop"
      onClick={() => {
        close();
      }}
    >
      <div
        className="sidebar-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <form onSubmit={handleSubmit} className="eventForm">
          <h1 className="heading">Form</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Your Title"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          ></input>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          ></input>
          <button>Submit</button>
        </form>
      </div>
    </div>
  ) : null;
};

export default EventForm;
