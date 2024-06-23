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
import { IoMenu } from "react-icons/io5";
import NavigationBar from "../NavigationMenu/NavigationBar";
import Sidebar from "../Sidebar/Sidebar";
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSeletedDateEvents] = useState([]);
  const [slotInfo, setSlotInfo] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
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

  const formats = {
    dateFormat: "D",
    dayFormat: (date, culture, localizer) =>
      localizer.format(date, "DDD", culture),
    monthHeaderFormat: (date, culture, localizer) =>
      localizer.format(date, "MMMM YYYY", culture),
  };

  useEffect(() => {
    const eventsforSelectedDay = () => {
      let { start, end } = slotInfo;

      const s = moment(selectedDate).startOf("day")._d;
      const e = moment(selectedDate).endOf("day")._d;

      if (start === undefined && end === undefined) {
        start = s;
        end = e;
      }
      const eventsForThisDay = events.filter(
        (event) =>
          moment(event.start).isSameOrBefore(moment(end), "day") &&
          moment(event.end).isSameOrAfter(moment(start), "day")
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
      <div className="calendarNavigation">
        <IoMenu
          onClick={() => setIsOpen(true)}
          className={"calendarMenuIcon" + (isOpen ? " hidden" : "")}
        />
        <Sidebar shown={isOpen} close={() => setIsOpen(!isOpen)}></Sidebar>
        <NavigationBar />
      </div>
      <div className="calendarSection">
        <div className="monthYear">
          <select
            name="month"
            value={moment(selectedDate).month()}
            onChange={handleDateChange}
            className="month"
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
            className="year"
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
          toolbar={false}
          views={["month"]}
          onSelectSlot={(info) => {
            setSlotInfo(info);
            setSelectedDate(info.start);
          }}
          longPressThreshold={1}
          onDrillDown={(newDate) => setSelectedDate(newDate)}
          formats={formats}
          date={selectedDate}
          selectable
          onNavigate={(date, view) => {
            setSelectedDate(date);
          }}
          popup={false}
        />
        <div className="buttonRoot">
          <button
            onClick={() => setShowForm(!showForm)}
            className="addNewButton"
          >
            Add New
          </button>
        </div>

        <EventForm
          shown={showForm}
          close={() => setShowForm(!showForm)}
          handleSubmit={addNewEvent}
        />
        <>
          {selectedDateEvents.length === 0 ? (
            <div className="message">
              No Events for {moment(selectedDate).format("DD-MM-YYYY")}
            </div>
          ) : (
            <>
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
    </div>
  );
};

export default MyCalendar;
