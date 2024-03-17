import React from "react";
import { firestore } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import DeleteIcon from "@material-ui/icons/Delete";
import "./styles.css";

const Event = ({ event, showForm, setShowForm }) => {
  const { currentUser } = useAuth();
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

  return (
    <div>
      <div>
        {event.title}
        {event.start}
      </div>

      <DeleteIcon onClick={() => deleteEvent(event.id)} />
    </div>
  );
};

export default Event;
