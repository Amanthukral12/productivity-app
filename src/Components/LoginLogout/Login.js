import React, { useRef, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import photo from "../../assets/logo.png";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to sign in");
    }
    setLoading(false);
  };
  return (
    <Grid className="loginRoot">
      <div className="ground">
        {/* <div className="loginPhoto">
                <img src={photo} className="loginImage" alt=""/>
            </div> */}
        {/* <picture className="loginPhoto">
                <source srcSet={photo2} className="loginImage" media="(max-width: 990px)" />
                <img src={photo} className="loginImage" alt=""/>
            </picture> */}

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
              inputRef={emailRef}
              required
            />
            <TextField
              label="Password"
              placeholder="Enter Password"
              type="password"
              inputRef={passwordRef}
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
