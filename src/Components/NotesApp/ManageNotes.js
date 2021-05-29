import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
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
                <Button onClick={onSubmitHandler}>Save</Button>
            );
         }
         return (
            <Button onClick={onSubmitHandler}>Update</Button>
         )
     }

     

    const onSubmitHandler = () => {
        const noteObj = { title, content };
        console.log(currentNote);
        (formType==="Add")?addNote(noteObj):updateNote(noteObj,currentNote.id, currentNote.index);
      
        setTitle("");
        setContent("");
    }; 
    return (
        <div>
        <form>
        <TextField 
            id="standard-basic" 
            label="Title"
            name="title" 
            onChange={handleChange}
            value={title} 
        />
        <div>
            <TextareaAutosize 
                aria-label="minimum height" 
                rowsMin={4} 
                placeholder="Add a Note..." 
                name="content"
                value={content} 
                onChange={handleChange} 
            />
        </div>
        {setFormType()}    
    </form>
        </div>
    )
}

export default ManageNotes
