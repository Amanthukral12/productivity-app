import React, { useState, useEffect } from 'react'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import "./ManageNotes.css"
const ManageNotes = ({addNote, currentNote, formType, updateNote }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    useEffect(() => {
        const setNote = () => {
           const { title, content } = currentNote; 
           setTitle(title);
           setContent(content);
        };
        if(currentNote !== null) {
            setNote();
        }
    }, [currentNote])

    const handleChange = (e) => {
        const val = e.target.value;
        switch (e.target.name) {
            case "title":
                setTitle(val);
                break;
            case "content":
                setContent(val);
                break;
            default: 
                 console.log("error"); 
        }
     };

     const setFormType = () => {
         if(formType === "Add"){
            return (
                <button type="submit" className="addbutton" onClick={onSubmitHandler}>Add</button>
            );
         }
         return (
            <button type="submit" className="addbutton" onClick={onSubmitHandler}>Update</button>
         )
     }

     

    const onSubmitHandler = () => {
        const noteObj = { title, content };
        if(noteObj.content===""){
            return;
        }
        console.log(noteObj)
        console.log(currentNote);
        (formType==="Add")?addNote(noteObj):updateNote(noteObj,currentNote.id, currentNote.index);
      
        setTitle("");
        setContent("");
    }; 
    return (
        <Card className="manageNotesRoot">
        <CardContent className="manageNotesForm">
        <input 
            placeholder="Add a Title..."
            label="Title"
            name="title" 
            onChange={handleChange}
            value={title}
            className="titleInput"
            
        />
            <textarea  
                rows={5} 
                placeholder="Add a Note..." 
                name="content"
                value={content} 
                onChange={handleChange}
                className="contentInput"
                
            />
        {setFormType()}    
    </CardContent>
        </Card>
    )
}

export default ManageNotes
