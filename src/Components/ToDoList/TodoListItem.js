import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { db } from '../../firebase';
import "./TodoListItem.css"
import DeleteIcon from '@material-ui/icons/Delete';
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
        <div className="rootItem">
           <ListItem>
                <ListItemText primary={todo} secondary={inprogress ? "inprogress" : "completed"} />
           </ListItem>

           <Button onClick={toggleInProgress}>{inprogress ? "Done" : "Undone"}</Button>
           <Button onClick={deleteTodo}><DeleteIcon /></Button>
        </div>
    )
}

export default TodoListItem
