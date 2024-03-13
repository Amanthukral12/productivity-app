import "../App.css";
import Signup from "./LoginLogout/Signup";
import Dashboard from "./Dashboard/Dashboard";
import Login from "./LoginLogout/Login";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./LoginLogout/PrivateRoute";
import ForgotPassword from "./LoginLogout/ForgotPassword";
import UpdateProfile from "./Dashboard/UpdateProfile";
import TodoList from "./ToDoList/TodoList";
import NotesApp from "./NotesApp/NotesApp";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute
              exact
              path="/update-profile"
              component={UpdateProfile}
            />
            <PrivateRoute exact path="/todo-list" component={TodoList} />
            <PrivateRoute exact path="/notes-app" component={NotesApp} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
