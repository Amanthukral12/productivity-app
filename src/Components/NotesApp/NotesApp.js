import React, { useState, useEffect } from "react";
import ManageNotes from "./ManageNotes";
import NotesList from "./NotesList";
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
import { IoMenu } from "react-icons/io5";
import Sidebar from "../Sidebar/Sidebar";
import "./NotesApp.css";
import NavigationBar from "../NavigationMenu/NavigationBar";
const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [formType, setFormType] = useState("Add");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  const userNotesCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/notes`
  );

  const addNote = async (noteObj) => {
    setError("");
    try {
      await addDoc(userNotesCollectionRef, {
        title: noteObj.title,
        content: noteObj.content,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const getNotes = () => {
      const notesData = query(
        userNotesCollectionRef,
        orderBy("timestamp", "desc")
      );
      return onSnapshot(notesData, (querySnapshot) => {
        const updatedNotes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          content: doc.data().content,
        }));
        if (isMounted) setNotes(updatedNotes);
      });
    };
    getNotes();
    return () => {
      isMounted = false;
    };
  }, []);

  const deleteNote = async (id) => {
    try {
      const userDeleteNoteDoc = doc(
        firestore,
        `users/${currentUser.uid}/notes/${id}`
      );
      await deleteDoc(userDeleteNoteDoc);
    } catch (error) {
      console.log(error);
    }
  };

  const selectNote = (index) => {
    setFormType("Update");
    const note = notes[index];
    note.id = notes[index].id;
    note.index = index;
    setCurrentNote(note);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateNote = async (noteObj, id, index) => {
    try {
      let newNotes = [...notes];
      newNotes[index] = noteObj;

      setNotes(newNotes);
      const userUpdateNoteDoc = doc(
        firestore,
        `users/${currentUser.uid}/notes/${id}`
      );
      await updateDoc(userUpdateNoteDoc, {
        id: id,
        title: newNotes[index].title,
        content: newNotes[index].content,
      });

      setFormType("Add");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="notesRoot">
      <div className="navigation">
        <IoMenu
          onClick={() => setIsOpen(true)}
          className={"menuIcon" + (isOpen ? " hidden" : "")}
        />
        <Sidebar shown={isOpen} close={() => setIsOpen(!isOpen)}></Sidebar>
        <NavigationBar />
      </div>
      <section className="notesSection">
        <h1 className="notesHeading">
          {currentUser.displayName}&apos;s Notes App 🎉
        </h1>
        <div>
          <ManageNotes
            formType={formType}
            updateNote={updateNote}
            currentNote={currentNote}
            addNote={addNote}
          />
          <div className="notesList">
            <NotesList
              notes={notes}
              deleteNote={deleteNote}
              selectNote={selectNote}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotesApp;
