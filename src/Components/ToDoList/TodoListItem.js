import React from 'react'
import { db } from '../../firebase';
import "./TodoListItem.css"
import DeleteIcon from '@material-ui/icons/Delete';
const TodoListItem = ({todo, inprogress, id, currentUser}) => {


    const deleteTodo = () => {
        db.collection("users").doc(currentUser.uid).collection("todos").doc(id).delete();
    }

    return (
        <div className="rootItem">
            <div className="listItem">{todo}</div>
            <button className="button" onClick={deleteTodo}><DeleteIcon /></button>
        </div>
    )
}

export default TodoListItem
