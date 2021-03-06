import React, { useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Quotes from './Components/Quotes/Quotes';
import "./Dashboard.css"
const Dashboard = () => {
    const [error, setError] = useState("");
    const [hour, setHour] = useState("");
    const [minutes, setMinutes] = useState("");
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
    const getTime = () => {
  
        let element = new Date(),
        hour = element.getHours();
        let minutes = element.getMinutes();
        
        setHour(hour);
        setMinutes(minutes);
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

    setInterval(getTime,1000)
   

    return (
        <div className="root">
        
            <h1>App Name</h1>
            
            <h1 className="time">{hour}:{minutes<10?"0"+minutes:minutes}</h1>
            <div className="greeting">{message}</div>
            <div className="name">{currentUser.displayName}</div>
            
            {/* Name */}
            
            
            {/* todo */}
            

            {error && <h1>{error}</h1>}
            
            
            <div>
            {/* <Link to="/update-profile">Update Profile</Link>
            <br />
            <Link to="/todo-list">Todo List</Link>
            <br/>
            <Link to="/notes-app">Notes App</Link> */}
        </div>
        
        <div onClick={handleLogout}>Logout</div>
        <Quotes />
        </div>
    )
}

export default Dashboard