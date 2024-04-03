import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../LoginLogout/Login.css";
import photo from "../../assets/logo.png";
const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const {
    currentUser,
    changePassword,
    changeEmail,
    updateName,
    updateProfileImage,
  } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.displayName !== null) {
      setName(currentUser.displayName);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    await updateName(name);

    if (email !== currentUser.email) {
      promises.push(changeEmail(email));
    }

    if (password !== "") {
      promises.push(changePassword(password));
    }

    promises.push(updateProfileImage());

    Promise.all(promises)
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Grid className="loginRoot">
      <div className="ground">
        <div className="loginSection">
          <img src={photo} alt="" className="logoImage" />
          <h2 className="loginHeading">Produkto</h2>
          {error && <h1 className="error">{error}</h1>}
          <h3 className="welcomeMessage">Update Profile</h3>
          <form onSubmit={handleSubmit} className="loginForm">
            <TextField
              placeholder="Enter Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
              value={name || currentUser.displayName}
            />
            <br />
            <TextField
              placeholder="Enter Email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              defaultValue={currentUser.email}
            />
            <br />
            <TextField
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <br />
            <TextField
              placeholder="Confirm Password"
              type="password"
              onChange={(e) => {
                setconfirmPassword(e.target.value);
              }}
            />
            <br />
            <button disabled={loading} type="submit" className="signin">
              Update Profile
            </button>
          </form>
          <h3>
            <Link to="/" className="newUser">
              Cancel
            </Link>
          </h3>
        </div>
      </div>
    </Grid>
  );
};

export default UpdateProfile;
