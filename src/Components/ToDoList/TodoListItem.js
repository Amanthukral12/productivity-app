import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
        <div className="listItemRoot">
        <ListItem className="listItem">
        <ListItemText primary={todo} secondary={inprogress ? "inprogress" : "completed"} />
        </ListItem>
        <div className="listItemRight">
        <button className="button" onClick={toggleInProgress}>{inprogress ? "Done" : "Undone"}</button>
        <button className="button" onClick={deleteTodo}><DeleteIcon /></button>
        </div>
        </div>
           
           
        </div>
    )
}

export default TodoListItem
