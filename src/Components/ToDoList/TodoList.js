import React, {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import { db } from '../../firebase';
import firebase from 'firebase'
import { useAuth } from '../../contexts/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import TodoListItem from './TodoListItem';
import "./TodoList.css"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer'
import Sidebar from '../Sidebar/Sidebar';
const TodoList = () => {
    const [todoInput, setTodoInput] = useState("");
    const [todos, setTodos] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const history=useHistory
    const handleLogout = async () => {
        setError('');
        try {
            await logout();
            history.pushState('/login');
        } catch {
            setError('Can not log out!');
        }
    }
    const addTodo = (e) => {
        e.preventDefault();
        db.collection("users").doc(currentUser.uid).collection("todos").add({
            inprogress: true,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            todo: todoInput,
        });
        setTodoInput("");
    }
    const getTodos = (e) => {
        db.collection("users").doc(currentUser.uid).collection("todos").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
           setTodos(
            querySnapshot.docs.map((doc) => ({
                id: doc.id,
                todo: doc.data().todo,
                inprogress: doc.data().inprogress
            }))
           )
        })
    }
    useEffect(() => {
        getTodos();
    },[])
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

      const onAddPopupClose = () => {
		setIsOpen(false);
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
                            /* background: "linear-gradient(to top, rgba(145, 178, 248, 0.3), rgba(145, 178, 248, 0.1))", */
                            backgroundColor: "rgba(255, 255, 255, 0.4)",
                            backdropFilter: "blur(4px)"
                            
						  },
						}}
					  >
						<Sidebar />
					  </Drawer>	
            <MenuIcon onClick={() => setIsOpen(true)} className="menuIcon" />
            <div>App Name</div>
            <img src={currentUser.photoURL}
            alt="Profile Image"
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
                    <MenuItem style={{width: "300px"}} onClick={handleClose}><Link to="/update-profile">Update Profile</Link></MenuItem>
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
                    setTodoInput(e.target.value)
                }}
                value={todoInput}>
                </input>
           <Button style={{display: "none"}} type="submit" onClick={addTodo}>Enter</Button>
           </form> 
           <div className="numberTodo">You have {todos.length} todo left</div>
           <div className="todoItem">
           {todos.map((todo) => (
            <TodoListItem todo={todo.todo} inprogress={todo.inprogress} id={todo.id} currentUser={currentUser} />
        ))}
           </div>
           
        </div>
    )
}

export default TodoList
