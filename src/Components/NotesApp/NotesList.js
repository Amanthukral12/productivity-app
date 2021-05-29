import React from 'react'
import Button from '@material-ui/core/Button';

const NotesList = ({notes, deleteNote, selectNote }) => {
    
    

    const noteList = notes.map((note, index) => {
        return(
            <div key={index}>
            {note.title}
            <br />
            {note.content}
            <br/>
            <Button onClick={() => {
                selectNote(index);
            }}>Update</Button>
            <Button onClick={() => {
                deleteNote(note.id);
            }}>Delete</Button>
            </div>
            
        )
    })

    return (
        <div >
        {noteList}
        </div>
    )
}

export default NotesList
