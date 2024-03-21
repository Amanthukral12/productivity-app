import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import HomeIcon from "@material-ui/icons/Home";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import EventIcon from "@material-ui/icons/Event";
import photo from "./logo1024.png";
const Sidebar = () => {
  return (
    <div className="sidebarRoot">
      <div className="sidebarHeader">
        <img src={photo} alt="" className="logo" />
        <div className="appName">Produkto</div>
      </div>
      <hr className="horizontalLine" />
      <div className="menu">
        <NavLink
          to="/"
          className={({ isActive }) =>
            "menuItems" + (isActive ? " selected" : "")
          }
        >
          <HomeIcon className="icons" />
          Home
        </NavLink>
        <NavLink
          to="/todo-list"
          className={({ isActive }) =>
            "menuItems" + (isActive ? " selected" : "")
          }
        >
          <PlaylistAddCheckIcon className="icons" />
          Todo List
        </NavLink>
        <NavLink
          to="/notes-app"
          className={({ isActive }) =>
            "menuItems" + (isActive ? " selected" : "")
          }
        >
          <NoteAddIcon className="icons" />
          Notes App
        </NavLink>
        <NavLink
          to="/event-reminder"
          className={({ isActive }) =>
            "menuItems" + (isActive ? " selected" : "")
          }
        >
          <EventIcon className="icons" />
          Event Reminder
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
