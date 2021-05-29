import React, { useState, useEffect } from 'react'
import ManageNotes from './ManageNotes';
import NotesList from './NotesList';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import firebase from 'firebase'
const NotesApp = () => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [formType, setFormType] = useState("Add");
    const { currentUser } = useAuth();
    
    const addNote = (noteObj) => {
        db.collection("users").doc(currentUser.uid).collection("notes").add({
            title: noteObj.title,
            content: noteObj.content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      
        
    }

    const getNotes = () => {
        db.collection("users").doc(currentUser.uid).collection("notes").onSnapshot((querySnapshot) => {
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
        <div>
        <h1>Your Notes App 🎉</h1>
        <ManageNotes formType={formType} updateNote={updateNote} currentNote={currentNote} addNote={addNote} />
        <NotesList notes={notes} deleteNote={deleteNote} selectNote={selectNote}/>
        
        
        </div>
    )
}

export default NotesApp
