import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Note from './Note';
import Button from '@material-ui/core/Button';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import firebase from 'firebase'
const NotesApp = () => {
    const [note, setNote] = useState({
        title:"",
        content:"",
    })
    const [notes, setNotes] = useState([]);
    const { currentUser } = useAuth();
    const handleChange = (e) => {
        const {name, value } = e.target;
        setNote((preValue) => {
            return {
                ...preValue,
                [name] : value,
            }
        })
    }

    
    const addNote = (e) => {
        e.preventDefault();
        db.collection("users").doc(currentUser.uid).collection("notes").add({
            title: note.title,
            content: note.content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setNote({
            title:"",
            content: ""
        });
        console.log(notes);
    }

    const getNotes = (e) => {
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

    const updateNote = () => {
        db.collection("users").doc(currentUser.uid).collection("notes").doc(id).update({title, content});
    }
    useEffect(() => {
        getNotes();
    },[])

    return (
        <div>
        <h1>Your Notes App 🎉</h1>
        <form>
            <TextField 
                id="standard-basic" 
                label="Title"
                name="title" 
                onChange={handleChange}
                value={note.title} 
            />
            <div>
                <TextareaAutosize 
                    aria-label="minimum height" 
                    rowsMin={4} 
                    placeholder="Add a Note..." 
                    name="content"
                    value={note.content} 
                    onChange={handleChange} 
                />
            </div>
            <Button onClick={addNote}>Add</Button>  
            <Button onClick={updateNote}>Update</Button>      
        </form>
        {notes.map((note) => (
            <Note title={note.title} content={note.content} id={note.id} key={note.id} currentUser={currentUser} />
        ))}
        </div>
    )
}

export default NotesApp
