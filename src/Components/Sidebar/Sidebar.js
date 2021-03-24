import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Sidebar.css"
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import HomeIcon from '@material-ui/icons/Home';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
const Sidebar = () => {
    return (
        <div className="sidebarRoot">
            <div className="sidebarHeader">
            <img src="./logo1024.png" alt="" className="logo"/> 
                <div className="appName">Producto</div>
            </div>
            <hr className="horizontalLine"/>
            <div className="menu">
                <NavLink exact to="/" className="menuItems" activeClassName="selected"><HomeIcon className="icons" />Home</NavLink>
                <NavLink to="/todo-list" className="menuItems" activeClassName="selected"><PlaylistAddCheckIcon className="icons" />Todo List</NavLink>
                <NavLink to="/notes-app" className="menuItems" activeClassName="selected"><NoteAddIcon className="icons" />Notes App</NavLink>
            </div>
        </div>
    )
}

export default Sidebar
