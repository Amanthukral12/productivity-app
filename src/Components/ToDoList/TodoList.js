import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { firestore } from "../../firebase";
import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import TodoListItem from "./TodoListItem";
import "./TodoList.css";

import Sidebar from "../Sidebar/Sidebar";
import NavigationBar from "../NavigationMenu/NavigationBar";
import { IoMenu } from "react-icons/io5";
const TodoList = () => {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const userTodosCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/todos`
  );

  const addTodo = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addDoc(userTodosCollectionRef, {
        inprogress: true,
        timestamp: serverTimestamp(),
        todo: todoInput,
      });
      setTodoInput("");
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const getTodos = async (e) => {
      const todoData = query(
        userTodosCollectionRef,
        orderBy("timestamp", "desc")
      );
      return onSnapshot(todoData, (querySnapshot) => {
        const updatedTodo = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          todo: doc.data().todo,
          inprogress: doc.data().inprogress,
        }));
        if (isMounted) setTodos(updatedTodo);
      });
    };
    getTodos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="todoRoot">
      <div className="todoNavigation">
        <IoMenu
          onClick={() => setIsOpen(true)}
          className={"todoMenuIcon" + (isOpen ? " hidden" : "")}
        />
        <Sidebar shown={isOpen} close={() => setIsOpen(!isOpen)}></Sidebar>
        <NavigationBar />
      </div>
      <div className="todoSection">
        <h1 className="todoHeading">
          {currentUser.displayName}&apos;s Todo List 🎉
        </h1>
        <form>
          <input
            type="text"
            placeholder="Add your Todo"
            className="inputTodo"
            onChange={(e) => {
              setTodoInput(e.target.value);
            }}
            value={todoInput}
          ></input>
          <Button style={{ display: "none" }} type="submit" onClick={addTodo}>
            Enter
          </Button>
        </form>
        <div className="numberTodo">You have {todos.length} todo left</div>
        <div className="todoItem">
          {todos.map((todo) => (
            <TodoListItem
              todo={todo.todo}
              inprogress={todo.inprogress}
              key={todo.id}
              id={todo.id}
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>

      {error && <h1>{error}</h1>}
    </div>
  );
};

export default TodoList;
