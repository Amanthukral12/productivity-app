import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useHistory } from "react-router-dom";
const AuthContext = React.createContext({
  currentUser: null,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateName: async () => {},
  updateProfileImage: async () => {},
  changeEmail: async () => {},
  changePassword: async () => {},
  doSendEmailVerification: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateName = (displayName) => {
    return updateProfile(auth.currentUser, { displayName });
  };

  const updateProfileImage = () => {
    return updateProfile(auth.currentUser, {
      photoURL:
        "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
    });
  };

  const changeEmail = (email) => {
    return updateEmail(auth.currentUser, email);
  };

  const changePassword = (password) => {
    return updatePassword(auth.currentUser, password);
  };

  const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/`,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      if (user.emailVerified) {
        setCurrentUser({ ...user });
        setLoading(false);
      } else {
        doSendEmailVerification();
        alert("verify email");
        logout().then(() => {
          history.push("/login");
        });
        setLoading(true);
      }
    } else {
      setCurrentUser(null);
      setLoading(true);
    }

    setLoading(false);
  }

  const value = {
    currentUser,

    setCurrentUser,
    signup,
    login,
    logout,
    resetPassword,
    changeEmail,
    changePassword,
    updateName,
    updateProfileImage,
    doSendEmailVerification,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
