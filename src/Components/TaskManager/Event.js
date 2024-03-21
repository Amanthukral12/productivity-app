import React from "react";
import { firestore } from "../../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import DeleteIcon from "@material-ui/icons/Delete";
import "./styles.css";
import { useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
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
      await updateDoc(userUpdateEventDoc, updatedEventData);
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
        <EditIcon onClick={() => setShowForm(true)} />
        <DeleteIcon onClick={() => deleteEvent(event.id)} />
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
