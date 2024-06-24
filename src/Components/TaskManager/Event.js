import React, { useState } from "react";
import { firestore } from "../../firebase";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import "./styles.css";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EventForm from "./EventForm";
const Event = ({ event }) => {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const deleteEvent = async (id) => {
    try {
      const userDeleteEventDoc = doc(
        firestore,
        `users/${currentUser.uid}/eventReminder/${id}`
      );
      await deleteDoc(userDeleteEventDoc);
    } catch (error) {
      console.log(error);
    }
  };

  const updateEvent = async (updatedEventData) => {
    try {
      const userUpdateEventDoc = doc(
        firestore,
        `users/${currentUser.uid}/eventReminder/${event.id}`
      );
      await updateDoc(userUpdateEventDoc, {
        ...updatedEventData,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="eventRoot">
      <div className="eventInfo">
        <span className="eventDate">{event.start}</span>
        <span className="eventTitle">{event.title}</span>
      </div>
      <div className="iconDiv">
        <MdEdit onClick={() => setShowForm(true)} className="eventIcon" />
        <MdDelete onClick={() => deleteEvent(event.id)} className="eventIcon" />
      </div>

      <EventForm
        shown={showForm}
        close={() => setShowForm(false)}
        event={event}
        handleSubmit={updateEvent}
      />
    </div>
  );
};

export default Event;
