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
import { useHistory, Link } from "react-router-dom";
import TodoListItem from "./TodoListItem";
import "./TodoList.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import Sidebar from "../Sidebar/Sidebar";
const TodoList = () => {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const userTodosCollectionRef = collection(
    firestore,
    "users",
    currentUser.uid,
    "todos"
  );
  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Can not log out!");
    }
  };
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
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="todoRoot">
      <div className="todoHeader">
        <Drawer
          open={isOpen}
          onClose={() => setIsOpen(false)}
          anchor="left"
          className="sidebar"
          PaperProps={{
            style: {
              width: "30vh",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(4px)",
            },
          }}
        >
          <Sidebar />
        </Drawer>
        <MenuIcon onClick={() => setIsOpen(true)} className="menuIcon" />
        <div style={{ color: "white", fontSize: "35px" }}>Produkto</div>
        <img
          src={currentUser.photoURL}
          alt="Profile"
          onClick={handleClick}
          className="profile"
        />
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem style={{ width: "300px" }} onClick={handleClose}>
            <Link to="/update-profile">Update Profile</Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
      <h1 className="heading">{currentUser.displayName}&apos;s Todo List 🎉</h1>
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
      {error && <h1>{error}</h1>}
    </div>
  );
};

export default TodoList;
