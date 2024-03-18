import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import Calendar from "./Calendar";
import { momentLocalizer } from "react-big-calendar";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from "../../firebase";
import {
  query,
  orderBy,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import EventForm from "./EventForm";
import Event from "./Event";
import "./styles.css";
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSeletedDateEvents] = useState([]);
  const [slotInfo, setSlotInfo] = useState([]);
  const { currentUser } = useAuth();

  const userEventsCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/eventReminder`
  );

  const CACHE_EXPIRATION_TIME = 60000;
  let lastCacheTime = 0;
  let cachedEvents = [];

  const getEventsFromCache = () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastCacheTime < CACHE_EXPIRATION_TIME) {
      return cachedEvents;
    } else {
      return null;
    }
  };

  const cacheEvents = (events) => {
    cachedEvents = events;
    lastCacheTime = new Date().getTime();
  };

  const getEvents = (setEvents) => {
    const cachedData = getEventsFromCache();
    if (cachedData !== null) {
      setEvents(cachedData);
    }

    const eventsData = query(
      userEventsCollectionRef,
      orderBy("timestamp", "desc")
    );

    return onSnapshot(eventsData, (querySnapshot) => {
      const updatedEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        start: doc.data().start,
        end: doc.data().end,
        allDay: doc.data().allDay,
      }));

      cacheEvents(updatedEvents);
      setEvents(updatedEvents);
    });
  };

  useEffect(() => {
    const unsubscribe = getEvents(setEvents);

    return () => {
      unsubscribe();
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

  useEffect(() => {
    const eventsforSelectedDay = () => {
      let { start, end } = slotInfo;
      const s = moment().startOf("day")._d;
      const e = moment().add(1, "day").startOf("day")._d;

      if (
        start === undefined &&
        end === undefined &&
        moment(selectedDate).format("YYYY-MM-DD") ===
          moment(new Date()).format("YYYY-MM-DD")
      ) {
        start = s;
        end = e;
      }

      const eventsForThisDay = events.filter(
        (event) =>
          event.start >= moment(start).format("YYYY-MM-DD") &&
          event.start < moment(end).format("YYYY-MM-DD")
      );
      setSeletedDateEvents(eventsForThisDay);
    };
    eventsforSelectedDay();
  }, [events, slotInfo, selectedDate]);

  const addNewEvent = async (newEventData) => {
    try {
      await addDoc(userEventsCollectionRef, {
        ...newEventData,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="calendarRoot">
      <div>
        <select
          name="month"
          value={moment(selectedDate).month()}
          onChange={handleDateChange}
        >
          {moment.months().map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select
          name="year"
          value={moment(selectedDate).year()}
          onChange={handleDateChange}
        >
          {Array.from({ length: 30 }, (_, i) => moment().year() + i).map(
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
        views={["month"]}
        style={{ height: "50vh", width: "50%" }}
        onSelectSlot={(info) => {
          setSlotInfo(info);
          setSelectedDate(info.start);
        }}
        selectable
        popup={true}
      />
      <button onClick={() => setShowForm(!showForm)}>Add New</button>
      <EventForm
        shown={showForm}
        close={() => setShowForm(!showForm)}
        handleSubmit={addNewEvent}
      />
      <>
        {selectedDateEvents.length === 0 ? (
          <div>No Events for {moment(selectedDate).format("DD-MM-YYYY")}</div>
        ) : (
          <>
            <div>
              <div> Events for {moment(selectedDate).format("DD-MM-YYYY")}</div>
            </div>
            {selectedDateEvents.map((event) => (
              <Event
                key={event.id}
                event={event}
                showForm={showForm}
                setShowForm={setShowForm}
              />
            ))}
          </>
        )}
      </>
    </div>
  );
};

export default MyCalendar;
