import "../App.css";
import Signup from "./LoginLogout/Signup";
import Dashboard from "./Dashboard/Dashboard";
import Login from "./LoginLogout/Login";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./LoginLogout/PrivateRoute";
import PrivateRoute2 from "./LoginLogout/PrivateRoute2";
import ForgotPassword from "./LoginLogout/ForgotPassword";
import UpdateProfile from "./Dashboard/UpdateProfile";
import TodoList from "./ToDoList/TodoList";
import NotesApp from "./NotesApp/NotesApp";
import MyCalendar from "./TaskManager/MyCalendar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/todo-list" element={<TodoList />} />
          <Route path="/notes-app" element={<NotesApp />} />
          <Route path="/event-reminder" element={<MyCalendar />} />
        </Route>
        <Route element={<PrivateRoute2 />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

export default App;
