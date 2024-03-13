import React, { useRef, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import photo from "../../assets/logo.png";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      history.push("/login");
    } catch {
      setError("Failed to create an account");
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

            <TextField
              label="Confirm Password"
              placeholder="Enter Password again"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setconfirmPassword(e.target.value);
              }}
              required
            />
            <br />
            <button disabled={loading} type="submit" className="signin">
              Signup
            </button>
          </form>
          <h3 className="newUser">
            Already have an account?{" "}
            <Link to="/login" className="newUser">
              Log In
            </Link>
          </h3>
        </div>
      </div>
    </Grid>
  );
};

export default Signup;
