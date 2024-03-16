import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import Calendar from "./Calendar";
import { momentLocalizer } from "react-big-calendar";
import { useAuth } from "../../contexts/AuthContext";

import { firestore } from "../../firebase";
import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  collection,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import EventForm from "./EventForm";
const localizer = momentLocalizer(moment);
const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const { currentUser } = useAuth();

  const userEventsCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/eventReminder`
  );

  useEffect(() => {
    let isMounted = true;
    const getEvents = () => {
      const eventsData = query(
        userEventsCollectionRef,
        orderBy("start", "desc")
      );
      return onSnapshot(eventsData, (querySnapshot) => {
        const updatedEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          start: doc.data().start,
          end: doc.data().end,
          allDay: doc.data().allDay,
        }));
        if (isMounted) setEvents(updatedEvents);
      });
    };
    getEvents();
    return () => {
      isMounted = false;
    };
  }, []);

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
    <>
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
        events={events}
        localizer={localizer}
        defaultDate={selectedDate}
        date={selectedDate}
        views={["month"]}
        style={{ height: "50vh", width: "50%" }}
        onNavigate={handleNavigate}
      />
      <button onClick={() => setShowForm(!showForm)}>Add New</button>
      <EventForm shown={showForm} close={() => setShowForm(!showForm)} />
    </>
  );
};

export default MyCalendar;
