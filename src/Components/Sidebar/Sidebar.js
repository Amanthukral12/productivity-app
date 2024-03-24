import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { LuListTodo } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { MdEvent } from "react-icons/md";
import photo from "./logo1024.png";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";

const Sidebar = ({ shown, close }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Can not log out!");
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return shown ? (
    <div
      className="sidebar-backdrop"
      onClick={() => {
        close();
      }}
    >
      <div
        className="sidebar-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="sidebarHeader">
          <img src={photo} alt="" className="logo" />
          <div className="appName">Produkto</div>
        </div>
        <hr className="horizontalLine" />
        <NavLink
          to="/"
          className={({ isActive }) =>
            "menuItems" + (isActive ? " selected" : "")
          }
        >
          <FaHome className="sidebarIcons" />
          Home
        </NavLink>
        <NavLink
          to="/todo-list"
          className={({ isActive }) =>
            "menuItems" + (isActive ? " selected" : "")
          }
        >
          <LuListTodo className="sidebarIcons" />
          Todo List
        </NavLink>
        <NavLink
          to="/notes-app"
          className={({ isActive }) =>
            "menuItems" + (isActive ? " selected" : "")
          }
        >
          <FaNoteSticky className="sidebarIcons" />
          Notes App
        </NavLink>
        <NavLink
          to="/event-reminder"
          className={({ isActive }) =>
            "menuItems" + (isActive ? " selected" : "")
          }
        >
          <MdEvent className="sidebarIcons" />
          Event Reminder
        </NavLink>
        <div className="profileRoot">
          <img
            src={currentUser.photoURL}
            alt="Profile"
            onClick={handleClick}
            className="profile"
          />
          <h3 className="sidebarDisplayName" onClick={handleClick}>
            {currentUser.displayName}
          </h3>
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
              <Link to="/update-profile">Update Profile</Link>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  ) : null;
};

export default Sidebar;
