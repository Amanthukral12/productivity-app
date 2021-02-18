import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
            Dashboard
            {error && <h1>{error}</h1>}
            <div>Email: {currentUser.email}</div>
            
        </div>
        <div onClick={handleLogout}>Logout</div>
        </>
    )
}

export default Dashboard