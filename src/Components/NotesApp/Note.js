import React from 'react'
import Button from '@material-ui/core/Button';
import { db } from '../../firebase';
const Note = ({title, content, id, currentUser}) => {
    const deleteNote = () => {
        db.collection("users").doc(currentUser.uid).collection("notes").doc(id).delete();
    }
    
    return (
        <div >
            <h1>{title}</h1>
            <br />
            <h3 style={{whiteSpace: "pre-line"}}>{content}</h3>
            
            <Button onClick={deleteNote}>X</Button>
        </div>
    )
}

export default Note
