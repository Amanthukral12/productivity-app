import React, { useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Quotes from './Components/Quotes/Quotes';

const Dashboard = () => {
    const [error, setError] = useState("");
    const [tick, setTick] = useState("");
    const [hours, setHours] = useState("");
    const [message, setMessage] =useState("");
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
    const getTick = () => {
  
        const element = new Date().toLocaleTimeString();
        setTick(element);
    }
     
    const getHours = () => {
        const today = new Date();
        let hours = today.getHours();
        setHours(hours);
        if(hours > 12 && hours<16){
            setMessage("Good Afternoon")   
        } else if(hours > 4 && hours < 12){
            setMessage("Good Morning")
        } else {
            setMessage("Good Evening!")
        } 
    }

    setTimeout(getHours,1000);

    setInterval(getTick,1000)
   

    return (
        <>
        <div>
            Producto
            {currentUser.displayName}
            <div>{tick}</div>
            <div>{message}</div>
            <div>{currentUser.displayName}</div>
            
            {/* Name */}
            
            
            {/* todo */}
            

            {error && <h1>{error}</h1>}
            
            
            <div>
            <Link to="/update-profile">Update Profile</Link>
            <br />
            <Link to="/todo-list">Todo List</Link>
            <br/>
            <Link to="/notes-app">Notes App</Link>
        </div>
        </div>
        <div onClick={handleLogout}>Logout</div>
        <Quotes />
        </>
    )
}

export default Dashboard