import React, { useState, useEffect } from "react";
import ManageNotes from "./ManageNotes";
import NotesList from "./NotesList";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory, Link } from "react-router-dom";
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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import Sidebar from "../Sidebar/Sidebar";
import "./NotesApp.css";
const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [formType, setFormType] = useState("Add");
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const history = useHistory;
  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Can not log out!");
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <div className="notesHeader">
        <Drawer
          open={isOpen}
          onClose={() => setIsOpen(false)}
          anchor="left"
          className="sidebar"
          PaperProps={{
            style: {
              width: "30vh",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(4px)",
            },
          }}
        >
          <Sidebar />
        </Drawer>
        <MenuIcon onClick={() => setIsOpen(true)} className="menuIcon" />
        <div style={{ color: "white", fontSize: "35px" }}>Produkto</div>
        <img
          src={currentUser.photoURL}
          alt="Profile"
          onClick={handleClick}
          className="profile"
        />
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem style={{ width: "300px" }} onClick={handleClose}>
            <Link to="/update-profile">Update Profile</Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
      <h1 className="heading">{currentUser.displayName}&apos;s Notes App 🎉</h1>
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
      {error && <h1>{error}</h1>}
    </div>
  );
};

export default NotesApp;
