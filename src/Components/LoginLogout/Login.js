import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import photo from "../../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      history.push("/");
    } catch {
      setError("Failed to sign in");
    }
    setLoading(false);
  };
  return (
    <Grid className="loginRoot">
      <div className="ground">
        <div className="loginSection">
          <img src={photo} alt="" className="logoImage" />
          <h2 className="loginHeading">Produkto</h2>
          {error && <h1 className="error">{error}</h1>}
          <h3 className="welcomeMessage">Welcome to Produkto</h3>
          <form onSubmit={handleSubmit} className="loginForm">
            <TextField
              label="Email"
              placeholder="Enter Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <TextField
              label="Password"
              placeholder="Enter Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <br />
            <div>
              <Link to="/forgot-password" className="forgotPassword">
                Forgot Password?
              </Link>
            </div>
            <button disabled={loading} type="submit" className="signin">
              Sign In
            </button>
          </form>
          <h3 className="newUser">
            New user?{" "}
            <Link className="newUser" to="/signup">
              {" "}
              Create Account{" "}
            </Link>
          </h3>
        </div>
      </div>
    </Grid>
  );
};

export default Login;
