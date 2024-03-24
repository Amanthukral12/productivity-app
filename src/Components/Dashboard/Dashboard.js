import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Sidebar/Sidebar";
import { IoMenu } from "react-icons/io5";
import "./Dashboard.css";
import NavigationBar from "../NavigationMenu/NavigationBar";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [hour, setHour] = useState("");
  const [hours, setHours] = useState("");
  const [message, setMessage] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  if (currentUser.displayName === null) {
    navigate("/update-profile");
  }

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

  return (
    <div className="root">
      <div className="dashboardNavigation">
        <IoMenu
          onClick={() => setIsOpen(true)}
          className={"dashboardMenuIcon" + (isOpen ? " hidden" : "")}
        />
        <Sidebar shown={isOpen} close={() => setIsOpen(!isOpen)}></Sidebar>
        <NavigationBar />
      </div>

      <div className="welcome">Welcome to Produkto</div>

      <h1 className="time">{hour}</h1>
      <div className="greeting">{message}</div>
      <div className="name">{currentUser.displayName}</div>

      {error && <h1>{error}</h1>}
    </div>
  );
};

export default Dashboard;
