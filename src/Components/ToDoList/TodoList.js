import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
const TodoList = () => {

    const [todoInput, setTodoInput] = useState("");
    const addTodo = (e) => {
        e.preventDefault();
        console.log("Adding a todo")
    }
    return (
        <div>
           <h1>Your Todo List 🎉</h1>
           <TextField 
           id="standard-basic" 
           label="Add your ToDo" 
           onChange={(e) => {
            setTodoInput(e.target.value)
            
            }} 
           value={todoInput}
            />
           <Button style={{display: "none"}} type="submit" onClick={addTodo}>Enter</Button> 
        </div>
    )
}

export default TodoList
