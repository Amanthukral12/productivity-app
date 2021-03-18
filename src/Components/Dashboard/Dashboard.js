import React, { useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Quotes from './Components/Quotes/Quotes';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Drawer from '@material-ui/core/Drawer'
import Sidebar from '../Sidebar/Sidebar';
import MenuIcon from '@material-ui/icons/Menu';
import "./Dashboard.css"
const Dashboard = () => {
    const [error, setError] = useState("");
    const [hour, setHour] = useState("");
    const [hours, setHours] = useState("");
    const [message, setMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
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
    const getTime = () => {
  
        let element = new Date().toLocaleTimeString();
        setHour(element);
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
        <div className="root" >
            <div style={{display: "flex", justifyContent: "space-between"}}>
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
                <h1>App Name</h1>
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
                
                {/* <div onClick={handleLogout} style={{width: "50px", cursor:"pointer"}}>Logout</div> */}
            </div>
            <div className="backgroundTile"></div>
            <h1 className="time">{hour}</h1>
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
        
        
        <Quotes />
        </div>
    )
}

export default Dashboard