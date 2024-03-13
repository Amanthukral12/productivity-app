import React, { useState } from "react";
import { useHistory, Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import Drawer from "@material-ui/core/Drawer";
import Sidebar from "../Sidebar/Sidebar";
import MenuIcon from "@material-ui/icons/Menu";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import "./Dashboard.css";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [hour, setHour] = useState("");
  const [hours, setHours] = useState("");
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  if (currentUser.displayName === null) {
    history.push("/update-profile");
  }
  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Can not log out!");
    }
  };
  const getTime = () => {
    let element = new Date().toLocaleTimeString();
    setHour(element);
  };

  const getHours = () => {
    const today = new Date();
    let hours = today.getHours();
    setHours(hours);
    if (hours > 12 && hours < 16) {
      setMessage("Good Afternoon!");
    } else if (hours > 4 && hours < 12) {
      setMessage("Good Morning!");
    } else {
      setMessage("Good Evening!");
    }
  };

  setTimeout(getHours, 1000);

  setInterval(getTime, 1000);

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
    <div className="root">
      <div
        style={{ display: "flex", justifyContent: "space-between", zIndex: 3 }}
      >
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
          <div className="profileMenuHead">
            <img
              src={currentUser.photoURL}
              alt="Profile"
              onClick={handleClick}
              className="menuProfileImage"
            />
            <h2>{currentUser.displayName}</h2>
            <h3>{currentUser.email}</h3>
          </div>
          <hr />
          <MenuItem style={{ width: "300px" }} onClick={handleClose}>
            <Link to="/update-profile" style={{ fontFamily: "sans-serif" }}>
              Update Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>

      <div className="welcome">Welcome to Produkto</div>

      <h1 className="time">{hour}</h1>
      <div className="greeting">{message}</div>
      <div className="name">{currentUser.displayName}</div>
      <div className="appIconsDiv">
        <NavLink to="/todo-list" className="appIcons" title="Todo List">
          <PlaylistAddCheckIcon className="icons" />
        </NavLink>
        <NavLink to="/notes-app" className="appIcons" title="Notes">
          <NoteAddIcon className="icons" />
        </NavLink>
      </div>
      {error && <h1>{error}</h1>}
    </div>
  );
};

export default Dashboard;
