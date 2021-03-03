import React, { useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Quotes from './Components/Quotes/Quotes';

const Dashboard = () => {
    const [error, setError] = useState("");
    
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

    

    return (
        <>
        <div>
            Producto
            {currentUser.displayName}
            {/* Time */}
            {/* Good Afternoon */}
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