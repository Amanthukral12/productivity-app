import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Sidebar.css"
const Sidebar = () => {
    return (
        <div>
            <div>
                <div>App logo</div>
                <div>App Name</div>
            </div>
            <div>
                <NavLink exact to="/" activeClassName="selected">Home</NavLink>
                <NavLink to="/todo-list" activeClassName="selected">Todo List</NavLink>
                <NavLink to="/notes-app" activeClassName="selected">Notes App</NavLink>
            </div>
        </div>
    )
}

export default Sidebar
