import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { db } from '../../firebase';
const TodoListItem = ({todo, inprogress, id, currentUser}) => {

    const toggleInProgress = () => {
        db.collection("users").doc(currentUser.uid).collection("todos").doc(id).update({
            inprogress: !inprogress
        })
    }

    const deleteTodo = () => {
        db.collection("users").doc(currentUser.uid).collection("todos").doc(id).delete();
    }

    return (
        <div style={{display:"flex", justifyContent:"space-around", width:"300px"}}>
           <ListItem>
                <ListItemText primary={todo} secondary={inprogress ? "inprogress" : "completed"} />
           </ListItem>

           <Button onClick={toggleInProgress}>{inprogress ? "Done" : "Undone"}</Button>
           <Button onClick={deleteTodo}>X</Button>
        </div>
    )
}

export default TodoListItem
