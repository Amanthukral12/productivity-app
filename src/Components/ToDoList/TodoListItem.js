import React from "react";
import { deleteDoc, collection, doc } from "firebase/firestore";
import { firestore } from "../../firebase";
import "./TodoListItem.css";
import { MdDelete } from "react-icons/md";
const TodoListItem = ({ todo, inprogress, id, currentUser }) => {
  const deleteTodo = async () => {
    try {
      const userTodosDoc = doc(
        firestore,
        `users/${currentUser.uid}/todos/${id}`
      );
      await deleteDoc(userTodosDoc);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rootItem">
      <div className="listItem">{todo}</div>
      <button className="button" onClick={deleteTodo}>
        <MdDelete />
      </button>
    </div>
  );
};

export default TodoListItem;
