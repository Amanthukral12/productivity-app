import './App.css';
import Signup from './LoginLogout/Signup';
import Dashboard from './Dashboard/Dashboard'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
    <Router>
    <AuthProvider>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/signup" component={Signup} />
    </Switch>
    </AuthProvider>
    </Router>
    </div>
  );
}

export default App;
