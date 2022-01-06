import React, { useState, useEffect } from 'react'
import ManageNotes from './ManageNotes';
import NotesList from './NotesList';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import { db } from '../../firebase';
import firebase from 'firebase'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer'
import Sidebar from '../Sidebar/Sidebar';
import './NotesApp.css';
const NotesApp = () => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [formType, setFormType] = useState("Add");
    const [anchorEl, setAnchorEl] = useState(null);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const history=useHistory
    const handleLogout = async () => {
        setError('');
        try {
            await logout();
            history.pushState('/login');
        } catch {
            setError('Can not log out!');
        }
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    
    const addNote = (noteObj) => {
        db.collection("users").doc(currentUser.uid).collection("notes").add({
            title: noteObj.title,
            content: noteObj.content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      
        
    }

    const getNotes = () => {
        db.collection("users").doc(currentUser.uid).collection("notes").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
           setNotes(
            querySnapshot.docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
                content: doc.data().content,
            }))
           )
        })
        
    }
    useEffect(() => {
        getNotes();
    },[]);

    const deleteNote = (id) => {
        db.collection("users").doc(currentUser.uid).collection("notes").doc(id).delete();
    }

    const selectNote = (index) => {
        setFormType("Update");
        const note = notes[index];
        note.id = notes[index].id;
        note.index=index;
        setCurrentNote(note);
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    }
    
    const updateNote = (noteObj, id, index) => {
          let newNotes = [...notes];
          newNotes[index] = noteObj;
            
          setNotes(newNotes);
            console.log(id);
          db.collection("users").doc(currentUser.uid).collection("notes").doc(id).update({
              id: id,
              title: newNotes[index].title,
              content: newNotes[index].content,

          });
          setFormType("Add");   
    }

    
    
   

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
                        backdropFilter: "blur(4px)"
                        
                      },
                    }}
                  >
                    <Sidebar />
                  </Drawer>	
        <MenuIcon onClick={() => setIsOpen(true)} className="menuIcon" />
        <div style={{color: "white", fontSize:"35px"}}>Produkto</div>
        <img src={currentUser.photoURL}
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
                <MenuItem style={{width: "300px"}} onClick={handleClose}><Link to="/update-profile">Update Profile</Link></MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                
            </Menu>
        </div>
       <h1 className="heading">{currentUser.displayName}&apos;s Notes App 🎉</h1>
        <ManageNotes formType={formType} updateNote={updateNote} currentNote={currentNote} addNote={addNote} />
        <div className="notesList">
        <NotesList notes={notes} deleteNote={deleteNote} selectNote={selectNote}/>
        </div>
        </div>
    )
}

export default NotesApp
