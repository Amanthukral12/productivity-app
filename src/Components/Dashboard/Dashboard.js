import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Quotes from './Components/Quotes/Quotes';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Drawer from '@material-ui/core/Drawer'
import Sidebar from '../Sidebar/Sidebar';
import MenuIcon from '@material-ui/icons/Menu';
import "./Dashboard.css"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
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
            setMessage("Good Afternoon!")
        } else if(hours > 4 && hours < 12){
            setMessage("Good Morning!")
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
     const photoUrl = "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";
    return (
        <div className="root" >
            <div style={{display: "flex", justifyContent: "space-between", zIndex: 3}}>
            <Drawer
						open={isOpen}
						onClose={() => setIsOpen(false)}
						anchor="left"
                        className="sidebar"
						PaperProps={{
						  style: {
							width: "30vh",
                            backgroundColor: "rgba(255, 255, 255, 0.4)",
                            backdropFilter: "blur(4px)" 
						  },
						}}
					  >
						<Sidebar />
					  </Drawer>	
            <MenuIcon onClick={() => setIsOpen(true)} className="menuIcon" />
            
                <img src={photoUrl}
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
                    <div className="profileMenuHead">
                        <img src={photoUrl}
                            alt="Profile"
                            onClick={handleClick}
                            className="menuProfileImage"
                        />
                        <h2>{currentUser.displayName}</h2>
                        <h3>{currentUser.email}</h3>
                    </div>
                    <hr />
                    <MenuItem style={{width: "300px"}} onClick={handleClose}><Link to="/update-profile" style={{fontFamily: "sans-serif"}}>Update Profile</Link></MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    
                </Menu> 
            </div>
            {<div className="custom-shape-divider-top-1616160906">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
                    </svg>
            </div>}
            
            <div className="welcome">Welcome to Producto</div>
            <h1 className="time">{hour}</h1>
            <div className="greeting">{message}</div>
            <div className="name">{currentUser.displayName}</div>
                {error && <h1>{error}</h1>}
            <div>
        </div>
        <Quotes />
        
            <div className="custom-shape-divider-bottom-1616160906">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
                    </svg>
            </div>
 

        </div>
    )
}

export default Dashboard