import React, {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import { db } from '../../firebase';
import firebase from 'firebase'
import { useAuth } from '../../contexts/AuthContext';
import TodoListItem from './TodoListItem';
const TodoList = () => {

    const [todoInput, setTodoInput] = useState("");
    const [todos, setTodos] = useState([]);
    const { currentUser } = useAuth();
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
        db.collection("users").doc(currentUser.uid).collection("todos").onSnapshot((querySnapshot) => {
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

    
    return (
        <div>
           <h1>Your Todo List 🎉</h1>
           <form>
           <TextField 
           id="standard-basic" 
           label="Add your ToDo" 
           onChange={(e) => {
            setTodoInput(e.target.value)
            
            }} 
           value={todoInput}
            />
           <Button style={{display: "none"}} type="submit" onClick={addTodo}>Enter</Button>
           </form> 
           {todos.map((todo) => (
               <TodoListItem todo={todo.todo} inprogress={todo.inprogress} id={todo.id} currentUser={currentUser} />
           ))}
        </div>
    )
}

export default TodoList
